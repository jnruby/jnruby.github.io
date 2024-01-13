import { createReverb, applyReverb } from './effects.js';
import { createDelay, applyDelayToOscillator } from './effects.js';

// Initialize audio context and gain node
let audioContext = new AudioContext();
let gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);

let currentFrequency1 = randomFrequency(65, 1000);
let currentFrequency2 = randomFrequency(65, 1000); // Frequency for the second oscillator
let isPlaying = false;

let sineOscillator1;
let sineOscillator2; // Second oscillator

let colorChangeIntervals = [];

document.addEventListener('DOMContentLoaded', () => {
    createColorBlocks();
});

function playAudio() {
    if (!isPlaying) {
        isPlaying = true;
        let freq1 = randomFrequency(65, 1000);
        let freq2 = randomFrequency(65, 1000);
        startGlissando(sineOscillator1, currentFrequency1, freq1, 'frequencyDisplay1', 'progressBar1');
        startGlissando(sineOscillator2, currentFrequency2, freq2, 'frequencyDisplay2', 'progressBar2');
        startColorChange();
            }
}
        window.playAudio = playAudio;
        window.stopAudio = stopAudio;

function stopAudio() {
    if (isPlaying) {
        isPlaying = false;
        let currentTime = audioContext.currentTime;
        gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.1); // Fade out before stopping

        setTimeout(() => {
            stopOscillator(sineOscillator1); // Stop first oscillator
            stopOscillator(sineOscillator2); // Stop second oscillator
            stopColorChange();
            resetAudioContext();
        }, 100); // Stop after fade-out
    }
}

function resetAudioContext() {
    audioContext.close();
    audioContext = new AudioContext();
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
}

function stopOscillator(oscillator) {
    if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
    }
}

function startGlissando(oscillator, currentFrequency, endFrequency, displayId, progressBarId) {
    if (!isPlaying) return;

    oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';

    let glissandoDuration = randomBetween(6, 15);
    let holdDuration = randomBetween(2, 5);

    oscillator.frequency.setValueAtTime(currentFrequency, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(endFrequency, audioContext.currentTime + glissandoDuration);

    // Apply effects to the oscillator
    applyReverb(oscillator, audioContext, 2, 2); // Example duration and decay parameters
    applyDelayToOscillator(oscillator, audioContext, 0.5, 0.5); // Example delay time and feedback


    oscillator.connect(gainNode);
    oscillator.start();

    updateProgressBar(oscillator.frequency, currentFrequency, endFrequency, progressBarId, glissandoDuration);

    setTimeout(() => {
        stopOscillator(oscillator);
        startGlissando(oscillator, endFrequency, randomFrequency(65, 1000), displayId, progressBarId); // Start the next glissando
    }, (glissandoDuration + holdDuration) * 1000);

    let noteName = frequencyToNoteName(endFrequency);
    updateFrequencyDisplay(noteName, displayId);
}

function updateProgressBar(frequency, startFreq, endFreq, progressBarId, duration) {
    const progressBar = document.getElementById(progressBarId);
    const updateFrequency = 100; // Update every 100ms
    let elapsed = 0;

    const interval = setInterval(() => {
        elapsed += updateFrequency;
        const currentFreq = frequency.value;
        const progress = (currentFreq - startFreq) / (endFreq - startFreq) * 100;
        progressBar.value = Math.max(0, Math.min(100, progress));

        if (elapsed >= duration * 1000) {
            clearInterval(interval);
        }
    }, updateFrequency);
}

function updateFrequencyDisplay(noteName, displayId) {
    document.getElementById(displayId).textContent = `Note: ${noteName}`;
}

function frequencyToNoteName(frequency) {
    const A4 = 440;
    const A4NoteNumber = 69; // MIDI note number for A4
    const halfStep = 12 * Math.log2(frequency / A4);
    const noteNumber = Math.round(halfStep) + A4NoteNumber;

    // Expanded scale including double sharps and double flats
    const scale = [
        "C", "C#", "Cx", "D", "D#", "Dx", "E", "E#", "F", "F#", "Fx", "G", 
        "G#", "Gx", "A", "A#", "Ax", "B", "B#", "C𝄫", "C#", "Cx", "D𝄫", "D#", 
        "Dx", "E𝄫", "E", "E#", "F𝄫", "F", "F#", "Fx", "G𝄫"
    ];
    
    const octaveOffset = Math.floor(noteNumber / scale.length);
    const noteIndex = noteNumber % scale.length;
    const noteName = scale[noteIndex];
    const octave = octaveOffset - 1;

    return noteName;
}
console.log(frequencyToNoteName(440)); // Should return A4



// Function to generate a random frequency
function randomFrequency(min, max) {
    return Math.random() * (max - min) + min;
}

// Function to generate a random duration
function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

// Slider for volume control
let slider = document.getElementById('volumeSlider');
slider.addEventListener('input', () => {
    gainNode.gain.cancelScheduledValues(audioContext.currentTime); // Cancel any scheduled changes
    gainNode.gain.setValueAtTime(slider.value, audioContext.currentTime); // Set gain immediately to slider's value
});

// generate color blocks
function createColorBlocks() {
    const container = document.getElementById('container');
    for (let i = 0; i < 24; i++) {
        let block = document.createElement('div');
        block.className = 'color-block';
        container.appendChild(block);
    }
}


function startColorChange() {
    const duration = 7 * 60 * 1000; // 7 minutes in milliseconds
    document.querySelectorAll('.color-block').forEach(block => {
        changeBlockColor(block, duration);
    });
}

function stopColorChange() {
    colorChangeIntervals.forEach(clearInterval);
    colorChangeIntervals = [];
}

function changeBlockColor(block, duration) {
    const endTime = Date.now() + duration;
    const interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = (currentTime - (endTime - duration)) / duration;
        
        if (currentTime >= endTime) {
            clearInterval(interval);
        }

        // Interpolate from green to violet over time
        const green = Math.floor(255 * (1 - elapsed));
        const red = Math.floor(148 + 107 * elapsed); // 148 (green) to 255 (violet)
        const blue = Math.floor(0 + 255 * elapsed);  // 0 (green) to 255 (violet)

        block.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    }, 1000); // Update every second
}
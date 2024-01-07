// Initialize audio context and gain node
let audioContext = new AudioContext();
let gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);
let currentFrequency = randomFrequency(65, 1000);
let isPlaying = false;
let sineOscillator;
let colorChangeIntervals = [];

document.addEventListener('DOMContentLoaded', () => {
    createColorBlocks();
});

function playAudio() {
    if (!isPlaying) {
        isPlaying = true;
        currentFrequency = randomFrequency(65, 1000); // Reset to a new random start frequency
        startGlissando();
        startColorChange();
    }
}

function stopAudio() {
    if (isPlaying) {
        isPlaying = false;
        let currentTime = audioContext.currentTime;
        gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.1); // Fade out before stopping

        setTimeout(() => {
            if (sineOscillator) {
                sineOscillator.stop();
                sineOscillator.disconnect();
            }
            audioContext.close();
            stopColorChange();
            audioContext = new AudioContext();
            gainNode = audioContext.createGain();
            gainNode.connect(audioContext.destination);
        }, 100); // Stop after fade-out
    }
}

// Function to start a glissando
function startGlissando() {
    if (!isPlaying) return;
    let fadeInDuration = 0.1; // 100 ms fade in
    let fadeOutDuration = 0.1; // 100 ms fade out
    let startTime = audioContext.currentTime;

    let sineOscillator = audioContext.createOscillator();
    sineOscillator.type = 'sine';

    let endFrequency = randomFrequency(65, 1000);
    let glissandoDuration = randomBetween(6, 15);
    let glissandoEndTime = startTime + glissandoDuration; // Calculate glissando end time
    let holdDuration = randomBetween(2, 5);

    sineOscillator.frequency.setValueAtTime(currentFrequency, audioContext.currentTime);
    sineOscillator.frequency.linearRampToValueAtTime(endFrequency, audioContext.currentTime + glissandoDuration);

    sineOscillator.connect(gainNode);
    sineOscillator.start();

    setTimeout(() => {
        sineOscillator.stop();
        currentFrequency = endFrequency; // Update frequency for next glissando
        startGlissando(); // Start the next glissando
    }, (glissandoEndTime + holdDuration - audioContext.currentTime) * 1000);

    let noteName = frequencyToNoteName(endFrequency); // send hz to notenames
    updateFrequencyDisplay(noteName);
} 


function updateFrequencyDisplay(noteName) {
    document.getElementById('frequencyDisplay').textContent = `Note: ${noteName}`;
}

function frequencyToNoteName(frequency) {
    const A4 = 440;
    const A4NoteNumber = 69; // MIDI note number for A4
    const halfStep = 12 * Math.log2(frequency / A4);
    const noteNumber = Math.round(halfStep) + A4NoteNumber;

    const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const octave = Math.floor(noteNumber / 12) - 1;
    const noteIndex = noteNumber % 12;
    const noteName = scale[noteIndex];

    // Calculate the difference in cents
    const centDifference = 1200 * Math.log2(frequency / A4) - Math.round(halfStep) * 100;

    // Determine if the note is closer to a quarter tone sharp or flat
    let quarterToneIndicator = '';
    if (centDifference > 25) {
        quarterToneIndicator = '^';
    } else if (centDifference < -25) {
        quarterToneIndicator = '_';
    }

    return noteName + quarterToneIndicator + octave;
}

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

function createColorBlocks() {
    const container = document.getElementById('container');
    for (let i = 0; i < 24; i++) {
        let block = document.createElement('div');
        block.className = 'color-block';
        container.appendChild(block);
    }
}

function startColorChange() {
    document.querySelectorAll('.color-block').forEach(block => {
        const interval = setInterval(() => changeBlockColor(block), Math.random() * 5000 + 2000);
        colorChangeIntervals.push(interval);
    });
}

function stopColorChange() {
    colorChangeIntervals.forEach(clearInterval);
    colorChangeIntervals = [];
}

function changeBlockColor(block) {
    const greenShade = `rgb(0, ${Math.floor(Math.random() * 256)}, 0)`;
    block.style.transition = 'background-color 2s'; // Slow transition for the color change
    block.style.backgroundColor = greenShade;
}
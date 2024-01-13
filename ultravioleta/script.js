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
        currentFrequency1 = randomFrequency(65, 1000);
        currentFrequency2 = randomFrequency(65, 1000);
        startGlissando(sineOscillator1, currentFrequency1, 'frequencyDisplay1');
        startGlissando(sineOscillator2, currentFrequency2, 'frequencyDisplay2');
        startColorChange();
    }
}

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

// Function to start a glissando
function startGlissando(oscillator, currentFrequency, displayId) {
    if (!isPlaying) return;

    oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';

    let endFrequency = randomFrequency(65, 1000);
    let glissandoDuration = randomBetween(6, 15);
    let holdDuration = randomBetween(2, 5);

    oscillator.frequency.setValueAtTime(currentFrequency, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(endFrequency, audioContext.currentTime + glissandoDuration);

    oscillator.connect(gainNode);
    oscillator.start();

    setTimeout(() => {
        stopOscillator(oscillator);
        startGlissando(oscillator, endFrequency, displayId); // Start the next glissando
    }, (glissandoDuration + holdDuration) * 1000);

    let noteName = frequencyToNoteName(endFrequency);
    updateFrequencyDisplay(noteName, displayId);
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
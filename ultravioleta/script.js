// Create an audio context
let audioContext = new AudioContext();
let isPlaying = false;
let endFrequency = randomFrequency(65.41, 1500);
let colorChangeIntervals = [];

document.addEventListener('DOMContentLoaded', () => {
    createColorBlocks();
});

function playAudio() {
    if (!isPlaying) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        isPlaying = true;
        startGlissando();
        startColorChange();
    }
}

function stopAudio() {
    if (isPlaying) {
        isPlaying = false;
        audioContext.close();
        stopColorChange();
    }
}

function createSpringReverb(context) {
    let feedback = context.createGain();
    let delay = context.createDelay();

    // Increase feedback gain and delay time for a longer reverb tail
    feedback.gain.value = 0.8;  // Higher value for more pronounced effect
    delay.delayTime.value = 0.3; // Longer delay for extended reverb

    delay.connect(feedback);
    feedback.connect(delay);

    return delay;
}

function applyDynamics(gainNode, startTime, endTime) {
    let swellDuration = randomBetween(6, 12);
    let midPoint = startTime + (endTime - startTime) / 2;

    gainNode.gain.setValueAtTime(0.5, startTime);
    gainNode.gain.linearRampToValueAtTime(1, midPoint);
    gainNode.gain.linearRampToValueAtTime(0.5, endTime);
}

function startGlissando() {
    let startTime = audioContext.currentTime;
    let glissandoDuration = randomBetween(5, 15); // gliss duration random between 5 and 15 seconds
    let glissandoEndTime = startTime + glissandoDuration;
    let holdEndTime = glissandoEndTime + randomBetween(1, 5); // hold time between 1 and 5 seconds

    let sineOscillator = audioContext.createOscillator();
    sineOscillator.type = 'sine'; 
    let squareOscillator = audioContext.createOscillator();
    squareOscillator.type = 'square';

    let springReverb = createSpringReverb(audioContext);
    let gainNode = audioContext.createGain();

    sineOscillator.frequency.setValueAtTime(endFrequency + 50, startTime);
    squareOscillator.frequency.setValueAtTime(endFrequency, startTime);
    endFrequency = randomFrequency(65.41, 1500);


    // Convert frequency to note name and update display
    let noteName = frequencyToNoteName(endFrequency);
    updateFrequencyDisplay(noteName);

    sineOscillator.frequency.linearRampToValueAtTime(endFrequency + 50, glissandoEndTime);
    squareOscillator.frequency.linearRampToValueAtTime(endFrequency, glissandoEndTime);

    sineOscillator.connect(gainNode);
    squareOscillator.connect(gainNode);
    gainNode.connect(springReverb);
    springReverb.connect(audioContext.destination);

    applyDynamics(gainNode, startTime, holdEndTime);

    sineOscillator.start(startTime);
    squareOscillator.start(startTime);
    sineOscillator.stop(holdEndTime);
    squareOscillator.stop(holdEndTime);

    if (isPlaying) {
        setTimeout(startGlissando, (holdEndTime - startTime) * 1000);
    }
        // Microphone setup
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            let micInput = audioContext.createMediaStreamSource(stream);
            let modulator = audioContext.createGain();
    
            // Connect the sine oscillator to the modulator
            sineOscillator.connect(modulator.gain);
    
            // Connect the microphone to the modulator
            micInput.connect(modulator);
    
            // Connect modulator to the rest of your audio chain
            modulator.connect(gainNode);
        }).catch(err => {
            console.error('Error accessing the microphone', err);
        });
}

function updateFrequencyDisplay(noteName) {
    document.getElementById('frequencyDisplay').textContent = `Note: ${noteName}`;
}

function frequencyToNoteName(frequency) {
    const A4 = 440;
    const A4NoteNumber = 69; // MIDI note 69 number for A4 (transposition?)
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

let noteName = frequencyToNoteName(endFrequency);
updateFrequencyDisplay(noteName);

// initiate color blocks
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
        const interval = setInterval(() => changeBlockColor(block), Math.random() * 5000 + 20000); // Changes every 5 to 40 seconds
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

function randomFrequency(min, max) {
    return Math.random() * (max - min) + min;
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}
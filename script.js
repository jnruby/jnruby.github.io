let audioContext;
let isPlaying = false;
let endFrequency = randomFrequency(65.41, 2093);
let colorChangeIntervals = [];

document.addEventListener('DOMContentLoaded', () => {
    createColorBlocks();
});

function createColorBlocks() {
    const container = document.getElementById('container');
    for (let i = 0; i < 24; i++) {
        let block = document.createElement('div');
        block.className = 'color-block';
        container.appendChild(block);
    }
}

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
    feedback.gain.value = 0.8;
    delay.delayTime.value = 0.04;

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
    let glissandoEndTime = startTime + 4;
    let holdEndTime = glissandoEndTime + 1;

    let oscillator = audioContext.createOscillator();
    let springReverb = createSpringReverb(audioContext);
    let gainNode = audioContext.createGain();

    oscillator.frequency.setValueAtTime(endFrequency, startTime);
    endFrequency = randomFrequency(65.41, 1500);
    oscillator.frequency.linearRampToValueAtTime(endFrequency, glissandoEndTime);

    oscillator.connect(gainNode);
    gainNode.connect(springReverb);
    springReverb.connect(audioContext.destination);

    applyDynamics(gainNode, startTime, holdEndTime);

    oscillator.start(startTime);
    oscillator.stop(holdEndTime);

    if (isPlaying) {
        setTimeout(startGlissando, (holdEndTime - startTime) * 1000);
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

function randomFrequency(min, max) {
    return Math.random() * (max - min) + min;
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}



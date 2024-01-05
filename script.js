let audioContext;
let isPlaying = false;
let endFrequency = randomFrequency(65.41, 2093);

function playAudio() {
    if (!isPlaying) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        isPlaying = true;
        startGlissando();
    }
}

function createSpringReverb(context) {
    let feedback = context.createGain();
    let delay = context.createDelay();
    feedback.gain.value = 0.8;
    delay.delayTime.value = 0.03;

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
    endFrequency = randomFrequency(65.41, 2093);
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

function stopAudio() {
    if (isPlaying) {
        isPlaying = false;
        audioContext.close();
    }
}

function randomFrequency(min, max) {
    return Math.random() * (max - min) + min;
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

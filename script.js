let audioContext;
let isPlaying = false;
let endFrequency = randomFrequency(65.41, 2093); // Initial end frequency

function playAudio() {
    if (!isPlaying) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        isPlaying = true;
        startGlissando();
    }
}

function startGlissando() {
    let startTime = audioContext.currentTime;
    let glissandoEndTime = startTime + 4;
    let holdEndTime = glissandoEndTime + 1;

    let oscillator = audioContext.createOscillator();
    let gainNode = audioContext.createGain();

    oscillator.frequency.setValueAtTime(endFrequency, startTime); // Start from the last end frequency
    endFrequency = randomFrequency(65.41, 2093); // Next random frequency
    oscillator.frequency.linearRampToValueAtTime(endFrequency, glissandoEndTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Swell dynamics
    applyDynamics(gainNode, startTime, holdEndTime);

    oscillator.start(startTime);
    oscillator.stop(holdEndTime);

    if (isPlaying) {
        setTimeout(startGlissando, (holdEndTime - startTime) * 1000);
    }
}

function applyDynamics(gainNode, startTime, endTime) {
    let swellDuration = randomBetween(6, 12);
    let midPoint = startTime + (endTime - startTime) / 2;

    // Swell up
    gainNode.gain.setValueAtTime(0.5, startTime);
    gainNode.gain.linearRampToValueAtTime(1, midPoint);

    // Swell down
    gainNode.gain.linearRampToValueAtTime(0.5, endTime);
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


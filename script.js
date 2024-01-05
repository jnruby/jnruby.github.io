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
    oscillator.frequency.setValueAtTime(endFrequency, startTime); // Start from the last end frequency
    endFrequency = randomFrequency(65.41, 2093); // Next random frequency
    oscillator.frequency.linearRampToValueAtTime(endFrequency, glissandoEndTime);
    oscillator.connect(audioContext.destination);
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

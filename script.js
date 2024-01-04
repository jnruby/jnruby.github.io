let endFrequency = randomFrequency(65.41, 2093); // Start with a random frequency

function playAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let startTime = audioContext.currentTime;
    let glissandoEndTime = startTime + 4; // End time of the glissando
    let holdEndTime = glissandoEndTime + 1; // End time of the hold

    const startFrequency = endFrequency; // Start from the last end frequency
    endFrequency = randomFrequency(65.41, 2093); // Next random end frequency

    const oscillator = audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(startFrequency, startTime);
    oscillator.frequency.linearRampToValueAtTime(endFrequency, glissandoEndTime);
    oscillator.connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(holdEndTime);

    setTimeout(playAudio, (holdEndTime - startTime) * 1000); // Schedule the next glissando
}

function randomFrequency(min, max) {
    return Math.random() * (max - min) + min;
}

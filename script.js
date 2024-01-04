function playRandomGlissando() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let startTime = audioContext.currentTime;
    let endTime = startTime + 4; // Duration of the glissando

    const startFrequency = randomFrequency(65.41, 2093); // Random frequency between C2 and C7
    const endFrequency = randomFrequency(65.41, 2093); // Another random frequency between C2 and C7

    const oscillator = audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(startFrequency, startTime);
    oscillator.frequency.linearRampToValueAtTime(endFrequency, endTime);
    oscillator.connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(endTime);
}

function randomFrequency(min, max) {
    return Math.random() * (max - min) + min;
}

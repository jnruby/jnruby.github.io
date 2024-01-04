function playGlissando() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let startTime = audioContext.currentTime;
    let endTime = startTime + 0.5 * 8; // Duration of the entire glissando

    const oscillator = audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(261.63, startTime); // Start at C4
    oscillator.frequency.linearRampToValueAtTime(523.25, endTime); // End at C5
    oscillator.connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(endTime);
}


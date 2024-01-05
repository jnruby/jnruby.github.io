let audioContext;
let oscillator;
let isPlaying = false;

function playAudio() {
    if (!isPlaying) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        continuePlaying();
        isPlaying = true;
    }
}

function continuePlaying() {
    let startTime = audioContext.currentTime;
    let glissandoEndTime = startTime + 4;
    let holdEndTime = glissandoEndTime + 1;

    oscillator = audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(randomFrequency(65.41, 2093), startTime);
    oscillator.connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(holdEndTime);

    setTimeout(() => {
        if (isPlaying) {
            continuePlaying();
        }
    }, (holdEndTime - startTime) * 1000);
}

function stopAudio() {
    if (isPlaying && audioContext) {
        oscillator.stop();
        audioContext.close();
        isPlaying = false;
    }
}

function randomFrequency(min, max) {
    return Math.random() * (max - min) + min;
}

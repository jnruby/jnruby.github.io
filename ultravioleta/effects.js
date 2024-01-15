export function createReverb(audioContext, duration = 4, decay = 2) {
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * duration;
    const impulse = audioContext.createBuffer(2, length, sampleRate);
    const impulseL = impulse.getChannelData(0);
    const impulseR = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
        const time = i / sampleRate;
        const damping = Math.exp(-decay * time);
        impulseL[i] = (Math.random() * 2 - 1) * damping;
        impulseR[i] = (Math.random() * 2 - 1) * damping;
    }

    const convolver = audioContext.createConvolver();
    convolver.buffer = impulse;

    return convolver;
}

export function applyReverb(oscillator, audioContext, duration, decay) {
    const reverb = createReverb(audioContext, duration, decay);
    oscillator.connect(reverb);
    reverb.connect(audioContext.destination);
}

export function createDelay(audioContext, delayTime = 0.5, feedbackAmount = 0.5) {
    const delay = audioContext.createDelay();
    const feedback = audioContext.createGain();

    delay.delayTime.value = delayTime;
    feedback.gain.value = feedbackAmount;

    delay.connect(feedback);
    feedback.connect(delay);

    // Create a gain node for the delayed signal
    const delayOutputGain = audioContext.createGain();
    feedback.connect(delayOutputGain);

    // Return the delay node and its output gain node
    return { delay, delayOutputGain };
}

export function applyDelayToOscillator(oscillator, audioContext, delayTime, feedbackAmount, outputGainNode) {
    const { delay, delayOutputGain } = createDelay(audioContext, delayTime, feedbackAmount);
    oscillator.connect(delay);
    delayOutputGain.connect(outputGainNode); // Connect delay output to the master gain node
}
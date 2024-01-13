export function createReverb(audioContext, duration = 2, decay = 2) {
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
    // Create the nodes
    const delay = audioContext.createDelay();
    const feedback = audioContext.createGain();

    // Configure delay time
    delay.delayTime.value = delayTime;

    // Configure feedback loop
    feedback.gain.value = feedbackAmount;
    delay.connect(feedback);
    feedback.connect(delay);

    // Return a node that can be connected to the audio graph
    const inputNode = audioContext.createGain();
    inputNode.connect(delay);
    inputNode.connect(audioContext.destination); // Direct path
    feedback.connect(audioContext.destination); // Feedback path

    return inputNode;
}

export function applyDelayToOscillator(oscillator, audioContext, delayTime, feedbackAmount) {
    const delayNode = createDelay(audioContext, delayTime, feedbackAmount);
    oscillator.connect(delayNode);
}
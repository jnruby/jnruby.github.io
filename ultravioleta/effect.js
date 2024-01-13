// spring reverb
function createSpringReverb(context) {
    let feedback = context.createGain();
    let delay = context.createDelay();

    // Adjust the reverb parameters here
    feedback.gain.value = 0.3;  // Higher value for more pronounced effect
    delay.delayTime.value = 0.2; // Longer delay for extended reverb

    delay.connect(feedback);
    feedback.connect(delay);

    return delay;
}

// simple delay effect
function createDelay(context) {
    let delayNode = context.createDelay();
    let feedback = context.createGain();

    // Adjust the delay parameters here
    delayNode.delayTime.value = 0.3; // Adjust delay time 
    feedback.gain.value = 0.3; // Adjust feedback amount 

    delayNode.connect(feedback);
    feedback.connect(delayNode);

    return delayNode;
}
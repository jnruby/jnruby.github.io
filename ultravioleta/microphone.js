export async function initializeMicrophone(audioContext) {
    try {
        // Request access to the microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Create a source node from the microphone input stream
        const microphoneSource = audioContext.createMediaStreamSource(stream);

        // Create an analyser node
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;

        // Connect the microphone source to the analyser
        microphoneSource.connect(analyser);

        // You can also connect the analyser to the destination if you want to hear the microphone input
        // analyser.connect(audioContext.destination);

        return { microphoneSource, analyser };
    } catch (err) {
        console.error('Error accessing the microphone:', err);
        throw err; // Rethrow the error so it can be caught where the function is called
    }
}

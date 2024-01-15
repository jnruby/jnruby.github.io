export async function initializeMicrophone(audioContext) {
    try {
        // Request access to the microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // source node from the microphone input stream
        const microphoneSource = audioContext.createMediaStreamSource(stream);

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;

        microphoneSource.connect(analyser);

        return { microphoneSource, analyser };
    } catch (err) {
        console.error('Error accessing the microphone:', err);
        throw err; // Rethrow the error so it can be caught where the function is called
    }
}

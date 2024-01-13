export async function initializeMicrophone(audioContext) {
    try {
        // Request access to the microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Create a source node from the microphone input stream
        const source = audioContext.createMediaStreamSource(stream);

        // Connect the source node to the destination (speakers)
        source.connect(audioContext.destination);

        return source;
    } catch (err) {
        console.error('Error accessing the microphone:', err);
        return null;
    }
}
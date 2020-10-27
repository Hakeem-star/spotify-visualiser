const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();

const bufferLength = analyser.fftSize;
const dataArray = new Float32Array(bufferLength);

window.isAudioPlaying = () => {
  analyser.getFloatTimeDomainData(dataArray);
  for (let i = 0; i < bufferLength; i++) {
    if (dataArray[i] != 0) return true;
  }
  return false;
};

navigator.mediaDevices
  .getDisplayMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    if (stream.getAudioTracks().length > 0) {
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      document.body.classList.add("ready");
    } else {
      console.log(
        "Failed to get stream. Audio not shared or browser not supported"
      );
    }
  })
  .catch((err) => console.log("Unable to open capture: ", err));

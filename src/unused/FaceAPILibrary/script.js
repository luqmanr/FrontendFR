const video = document.getElementById('vid')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideoNew)

async function startVideoNew() {

  var constraints = {
    audio: false,
    video: {
      width: 720,
      height: 560
    }
  }

  try {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(mediaStream => {
          const video = document.querySelector('vid');
          vid.srcObject = mediaStream;
          vid.onloadedmetadata = function(e) {
              vid.play();
          };
          // this.captureVideo(video);
        });
  }
  catch(e) {
    console.error("no video")
  }
}


function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => vid.srcObject = stream,
    err => console.error(err),
    // console.log(video_old)
  )
}

vid.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(vid)
  document.body.append(canvas)
  const displaySize = { width: vid.width, height: vid.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(vid, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})
let video;
let mediaStream;
let currentDeviceId = null;
let isFlashOn = false;
let parentWindow = window.opener;

async function initCamera() {
    const constraints = {
        video: {
            facingMode: currentDeviceId ? { exact: currentDeviceId } : 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
        },
        audio: false
    };

    try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        video = document.getElementById('video');
        video.srcObject = mediaStream;
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
}

function takePhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoUrl = canvas.toDataURL('image/jpeg');
    parentWindow.showCapturedPhoto(photoUrl);
    closeCamera();
}

async function toggleCamera() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    let nextDeviceId;
    if (currentDeviceId) {
        const currentIndex = videoDevices.findIndex(device => device.deviceId === currentDeviceId);
        nextDeviceId = videoDevices[(currentIndex + 1) % videoDevices.length].deviceId;
    } else {
        nextDeviceId = videoDevices[1]?.deviceId || videoDevices[0].deviceId;
    }
    currentDeviceId = nextDeviceId;
    closeCamera();
    initCamera();
}

async function toggleFlash() {
    if (mediaStream) {
        const track = mediaStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        if (capabilities.torch) {
            isFlashOn = !isFlashOn;
            track.applyConstraints({ video: { torch: isFlashOn } });
        }
    }
}

function closeCamera() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
    }
    window.close();
}

initCamera();
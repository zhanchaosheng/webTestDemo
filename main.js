let newWindow = null;

function openCamera() {
    newWindow = window.open('camera.html', '_blank', 'width=600,height=800');
}

function showCapturedPhoto(photoUrl) {
    document.getElementById('dynamicImage').src = photoUrl;
}
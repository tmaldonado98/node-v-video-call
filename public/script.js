const socket = io('/');

const videoContainer = document.getElementById('video-container')

const createVideo = document.createElement('video');
createVideo.muted = true;


function videoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })

    videoContainer.append(video);
}

// function connectToNewUser(user, stream) {

// }


navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
.then(stream => { 
    videoStream(createVideo, stream);
    
    socket.on('user-connected', user => {
        videoStream(video, stream)
    })
})
    
// const clientIP = socket.request.connection.remoteAddress;
socket.emit('join-room', { room: ROOM_ID });
// , { user: clientIP }

socket.on('user-connected', userIp => {
    console.log(userIp + ' has joined the call.')
})


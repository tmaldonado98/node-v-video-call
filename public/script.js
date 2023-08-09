const socket = io('/');
const peer = new Peer(undefined, {
    host: '/',
    port: 3001,
});


// as soon as client connects to peer server and gets back unique client id, run this method
peer.on('open', peerId => {
    socket.emit('join-room', ROOM_ID, peerId)
    console.log('peer on open', peerId)
});


const videoContainer = document.getElementById('video-container')

const createVideo = document.createElement('video');
createVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
    .then(stream => {
        // console.log(stream)  
        videoStream(createVideo, stream);
        
        // //////////////////////////!!!!!
        peer.on('call', call => {
            console.log('peer on call')
            // peer is answering the call by sending back their own media stream
            call.answer(stream)
            
            const newVideo = document.createElement('video');
            call.on('stream', userVideoStream => {
                videoStream(newVideo, userVideoStream)
                console.log(userVideoStream)
            })
            
        })
        
        socket.on('user-connected', peer => {
            connectToNewUser(peer, stream)   
            console.log(peer + ' has joined the call.')
            
            // socket.emit('confirmation', peer);
            
        
        })
        

    })
    .catch(error => console.error('Error accessing media devices:', error))
            

// socket.on('user-disconnected', userId => {
//     if (peers[userId]) peers[userId].close()
// });

    
function videoStream(video, stream) {

    video.srcObject = stream;
    
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    
    videoContainer.append(video);
}


function connectToNewUser(user, stream) {

    const outgoingCall = peer.call(user, stream);
    console.log(user, stream)
    
    // console.log(outgoingCall)

    const video = document.createElement('video');
    
    // receiving peer's media stream and appending it to our UI
    outgoingCall.on('stream', peerStream => {
        videoStream(video, peerStream)
    })
     
    outgoingCall.on('close', () => {
        video.remove()
    })
    
}


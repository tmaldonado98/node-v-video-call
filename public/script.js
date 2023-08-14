const socket = io();
const peer = new Peer(undefined, {
    host: '/',
    port: 3001,
});


// as soon as client connects to peer server and gets back unique client id, run this method
peer.on('open', peerId => {
    socket.emit('join-room', ROOM_ID, peerId)
    console.log('peer on open', peerId);


        peer.on('call', (call, stream) => {
            console.log('peer on call', call)

            // peer is answering the call by sending back their own media stream
            call.answer(stream)
            
            const newVideo = document.createElement('video');
            call.on('stream', stream => {
                videoStream(newVideo, stream)
                console.log(stream)
            })
            
            call.on('close', () => {
                newVideo.remove()
            })
        })
});


const videoContainer = document.getElementById('video-container')

const createVideo = document.createElement('video');
createVideo.muted = true;

const peers = {};

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
    .then(stream => {
        console.log(peer)  
        videoStream(createVideo, stream);
        
        socket.on('user-connected', peer => {
            // if (!peers[peer]) {
            //     peers[peer] = peer;
            //     connectToNewUser(peer, stream);
            // }

            connectToNewUser(peer, stream)   
            console.log(peer + ' has joined the call.')
            
            console.log(stream);
            // socket.emit('confirmation', peer);
            
        })
        
        // // //////////////////////////!!!!!
        // peer.on('call', call => {
        //     console.log('peer on call', call)

        //     // peer is answering the call by sending back their own media stream
        //     call.answer(stream)
            
        //     const newVideo = document.createElement('video');
        //     call.on('stream', stream => {
        //         videoStream(newVideo, stream)
        //         console.log(stream)
        //     })
            
        // })
        

    })
    .catch(error => console.error('Error accessing media devices:', error))
            

socket.on('user-disconnected', user => {
    console.log()
    if (peers[user]) peers[user].close()
    
});

    
function videoStream(video, stream) {

    video.srcObject = stream;
    
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    
    videoContainer.append(video);
}


function connectToNewUser(user, stream) {

    const call = peer.call(user, stream);
    // console.log(user, stream)    
    
    peers[user] = call;
    // console.log(peers[user])

    const video = document.createElement('video');
    
    // receiving peer's media stream and appending it to our UI
    call.on('stream', stream => {
        videoStream(video, stream)
        console.log('call on stream executing')
    })
     
    call.on('close', () => {
        video.remove()
    })
    
}


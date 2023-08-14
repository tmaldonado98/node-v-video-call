const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidV4 } = require('uuid');
const io = require('socket.io')(server);
// setting socket io on top of http server



app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (request, response) => {
    response.redirect(`/${uuidV4()}`)
})

app.get('/:room', (request, response) => {

    // object sends data for room.ejs (template) to display
    response.render('roomTemplate', { room: request.params.room });

})

io.on('connection', socket => {
    // const uuid = uuidV4();
    // socket.id = uuid;
    // console.log(socket.id)

    // Check if the sockets connected object is defined

    socket.on('join-room', (room, peer) => {
        // console.log(room, peer);

        socket.join(room);
        // socket.emit('user-connected', peer)

        socket.to(room).emit('user-connected', peer)
        console.log(peer + ' has joined the call.')

        socket.on('disconnect', () => {
            console.log(peer + ' has left the room.')
            socket.to(room).emit('user-disconnected', peer)
        })
    })

    // socket.on('confirmation', peer => {
    //     console.log(peer + ' has joined the call.')
    // })

})

// need to listen to when a peer joins, to send stream back to peer.

server.listen(3000)

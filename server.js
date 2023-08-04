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

    response.render('roomTemplate', { roomId: request.params.room });

})
// object sends data for room.ejs (template) to display

io.on('connection', socket => {
    const clientIP = socket.request.connection.remoteAddress;
    console.log('Client IP:', clientIP);


    socket.on('join-room', (room, user) => {
        // console.log(room, user);

        socket.join(room);
        socket.emit('user-connected', clientIP)
    })

})

server.listen(3000)

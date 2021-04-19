const express = require('express');
const http = require('http');
const app = express();

const clientPath = `${__dirname}/../client`;
app.use(express.static(clientPath));

const server = http.createServer(app);

server.listen(8080,() => {console.log("server running on 8080");});

const io = require('socket.io')(server);

let counter = 1;

io.on('connection', socket => {
    console.log(counter + 'someone connected');
    counter++;

    socket.on('send message to everyone', message => {
        io.emit('display message', message);
    });

    socket.on('send message to myself', message => {
        socket.emit('display message', message);
    })
})


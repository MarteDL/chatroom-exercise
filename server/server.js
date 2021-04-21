const express = require('express');
const http = require('http');
const app = express();

const clientPath = `${__dirname}/../client`;
app.use(express.static(clientPath));

const server = http.createServer(app);

server.listen(8080, () => {
    console.log("server running on 8080");
});

const io = require('socket.io')(server);

let users = [];

io.on('connection', socket => {

    let currentUser = null;

    socket.on('disconnect', () => {

        let index = users.findIndex(user => user.username === currentUser.username);
        users.splice(index, 1);

        console.log('users list after disconnect: ')
        console.log(users);

        io.emit('user list', users);
    })


    socket.on('new user', user => {

        for (let oldUser of users) {
            if (user.username === oldUser.username) {
                user = null;
                break;
            }
        }

        if (user !== null) {
            currentUser = user;
            users.push(user);
        }

        console.log('user array after new user: ');
        console.log(users);

        io.emit("user list", users);
    })

    socket.on('send message to everyone', (user, message) => {
        io.emit('display message', user, message);
    });

    socket.on('send message to myself', (user, message) => {
        socket.emit('display message', user, message);
    });

    socket.on('send private message', (senderName, receiverName, message) => {
        users.forEach(user => {
            if(user.username === receiverName){
                io.to(user.socketId).emit('display private message of friend', senderName, message);
                socket.emit('display private message of myself', senderName, message);
            }
        })
    })
})


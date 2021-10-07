const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');
const { message } = require('statuses');




//PORT
const port = '8000';

//MIDLEWARE
app.use(express.static(path.join(__dirname, '/client')));

//DATA
const messages = [];
const users = [];

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, './client/index.html'));
})


const server = app.listen(port, () => {
    console.log('Your app is running on port ',port);
});

//SOCKET-SERVER-SET-UP
const io = socket(server);

io.on('connection', (socket) => {
    socket.on('message', (message) => {
        messages.push(message);
        socket.broadcast.emit('message', message);
      });
    
      socket.on('newUser', (user) => {
        users.push({person: user.author, id: socket.id});
        const someoneJoin = user.author + ' has joined';
        messages.push({author: 'bot', content: someoneJoin});
        socket.broadcast.emit('message', {author: 'bot', content: someoneJoin});
    });

    socket.on('disconnect', () => {
        let userWhoLeft = users.find(user => user.id === socket.id);
        let deleteLeavingUser = users.findIndex(user => user.id === socket.id);
        users.splice(deleteLeavingUser, 1);
        const message = '<i>'+userWhoLeft.person + ' has left the meeting</i>';
        messages.push({author: 'Chat Bot', content: message});
        socket.broadcast.emit('message', {author: 'bot', content: message});
    })
});

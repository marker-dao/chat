const path = require('node:path');

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

app.use(express.static(path.join(__dirname, './public')));

const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    socket.broadcast.emit('message', msg);
  });

  socket.on('typingstart', (e) => {
    socket.broadcast.emit('typingstart', e);
  });

  socket.on('typingend', (e) => {
    socket.broadcast.emit('typingend', e);
  });

  socket.on('disconnect', (e) => {
    io.emit('typingend', e, socket.id);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

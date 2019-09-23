const path = require('path');
const http = require('http');
const express = require('express');
const fs = require('fs');
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public');
const socketIO = require('socket.io');
//console.log(__dirname + '/../public');
//console.log(publicPath);
const {generateMessage} =require('./utility/message');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection',(socket) =>{
  console.log('Hello! New User');
  socket.emit('newMessage', generateMessage('Hello', 'Whats the issue?'));

 //socket.emit('newMsg',{
//   from:"Atul",
//   text:"Can we help you?",
//   createAt: "23rd September"

 //});
 socket.broadcast.emit('newMessage', generateMessage('Hello', 'New User'));
socket.on('createMsg',(message) =>{
  console.log('createMsg', message);

   io.emit('newMessage', generateMessage(message.from, message.text));

  });


  socket.on('disconnect', () => {
    console.log("Disconnected from client");
});
});
//app.get('/',(req,res) => {
//  res.render('index.html')
//});
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

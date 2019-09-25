const path = require('path');
const http = require('http');
const express = require('express');
const fs = require('fs');
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public');
const socketIO = require('socket.io');
//console.log(__dirname + '/../public');
//console.log(publicPath);
const {generateMessage, generateLocMessage} =require('./utility/message');
const {isRealString} = require('./utility/validation');
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
 socket.on('join', (params,callback) => {
  if(!isRealString(params.part1) || !isRealString(params.part2))
  callback('UniqueID and OrderNo are not available');
   callback();

 });
 socket.broadcast.emit('newMessage', generateMessage('Delivery Portal', 'Hello! New User'));
socket.on('createMsg',(message, callback) =>{
  console.log('createMsg', message);

 io.emit('newMessage', generateMessage(message.from, message.text));
   callback('Message received');
  });

  socket.on('locMsg', (coords) => {
    io.emit('newLocMessage', generateLocMessage('User',coords.latitude,coords.longitude));
  })


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

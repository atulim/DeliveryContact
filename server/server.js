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
const {Users} = require('./utility/userinfo');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
app.use(express.static(publicPath));

io.on('connection',(socket) =>{
  console.log('Hello! New User');


 //socket.emit('newMsg',{
//   from:"Atul",
//   text:"Can we help you?",
//   createAt: "23rd September"

 //});
 socket.on('join', (params,callback) => {
  if(!isRealString(params.part1) || !isRealString(params.part2))
  return callback('UniqueID and OrderNo are not available');
   socket.join(params.part2);
   users.removeUser(socket.id);
   users.addUser(socket.id, params.part1, params.part2);
   io.to(params.part2).emit('updateUserList', users.getUserList(params.part2));
   socket.emit('newMessage', generateMessage('Delivery Portal', 'Hello! Whats the issue?'));
   socket.broadcast.to(params.part2).emit('newMessage', generateMessage('Delivery Portal', `Hello! ${params.part1} has joined.`));
    callback();
 });

socket.on('createMsg',(message, callback) =>{
  console.log('createMsg', message);

 io.emit('newMessage', generateMessage(message.from, message.text));
   callback('Message received');
  });

  socket.on('locMsg', (coords) => {
    io.emit('newLocMessage', generateLocMessage('User',coords.latitude,coords.longitude));
  })


  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if(user)
    {
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Delivery Portal',`${user.name} has left`));
    }
});
});
//app.get('/',(req,res) => {
//  res.render('index.html')
//});
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

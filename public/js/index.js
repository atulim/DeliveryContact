var socket = io();
socket.on('connect',function(){
  console.log("Connected to server");
  //socket.emit('createMsg',{
  //  to: 'The delivery boys address',
  //  text: 'He is on the way'
  //});
});
socket.on('disconnect', function() {
  console.log("Disconnected from server");
});

socket.on('newMessage',function(message){
  console.log('newMessage',message);
});

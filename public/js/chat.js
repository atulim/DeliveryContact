var socket = io();

function scroll(){

  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();
  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight)
  {
    messages.scrollTop(scrollHeight);
  }
}

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
  var fT = moment().format('h:mm a, MMM/DD/YYYY');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template,{
    text:message.text,
    from:message.from,
    createdAt:fT
  });

  jQuery('#messages').append(html);
  scroll();
  //console.log('newMessage',message);
  //var li = jQuery('<li></li>');
  //li.text(`${message.from} : ${message.text}`);
  //jQuery('#messages').append(li);
});

socket.on('newLocMessage',function(message){
  var fT = moment().format('h:mm a, MMM/DD/YYYY');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template,{
   from:message.from,
    url:message.url,
    createdAt:fT
  });
    jQuery('#messages').append(html);
    scroll();

  //  var li = jQuery('<li></li>');
  //  var anchor = jQuery('<a target="_blank">My house location</a>');
  //  li.text(`${message.from}: `);
  //  anchor.attr('href',message.url);
  //  li.append(anchor);
  //  jQuery('#messages').append(li);
});

//socket.emit('createMsg', {
//  from: 'Frank' ,
//  text: 'Hi'
//}, function(data){
//  console.log('Got it ',data);
//});

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
   var textBox = jQuery('[name=message]');
  socket.emit('createMsg',{
    from: 'User' ,
    text: textBox.val()
  }, function() {
       textBox.val('');
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click',function(){
  if(!navigator.geolocation)
  {
    return alert('Location not supported');
  }
  locationButton.attr('disabled','disabled').text('Delivering');
  navigator.geolocation.getCurrentPosition(function(position){
    locationButton.removeAttr('disabled').text('Location');
    console.log(position);
    socket.emit('locMsg',{
      latitude: position.coords.latitude ,
      longitude: position.coords.longitude

    });
  }, function(){
    locationButton.removeAttr('disabled');
    alert('Unable to get location');
  });
});

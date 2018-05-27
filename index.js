var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
  let connectedClient = socket.handshake.query.nickname
  io.emit('connected info', connectedClient);
  socket.on('disconnect', function(){
    io.emit('disconnect info', connectedClient);
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg, connectedClient);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

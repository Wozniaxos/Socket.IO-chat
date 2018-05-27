var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const onlineMembers = [];

app.get('/', (req, res) =>{
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/online', (req, res) => {
  res.send(onlineMembers);
});

io.on('connection', (socket) => {
  let connectedClient = socket.handshake.query.nickname;
  onlineMembers.push(connectedClient);
  io.emit('connected info', connectedClient);
  io.emit('update online', onlineMembers);

  socket.on('disconnect', () => {
    io.emit('disconnect info', connectedClient);
    removeOnlineUser(connectedClient);
    io.emit('update online', onlineMembers);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg, connectedClient);
  });
});

const removeOnlineUser = (user) => {
  let index = onlineMembers.indexOf(user);
  index > -1 ? onlineMembers.splice(index, 1) : false;
};

http.listen(3000, function(){
  console.log('listening on *:3000');
});

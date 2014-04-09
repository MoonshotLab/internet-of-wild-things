var cores = require('./cores');
var _ = require('lodash');
var io = null;

cores.getClients().forEach(function(client){
  client.subscribe('input-update').on('update', function(e){
    io.sockets.emit('input-update', e);
  });
});

exports.init = function(connector){
  io = connector;

  io.sockets.on('connection', function(socket){
    socket.on('set-pin-val', cores.setPin);
    socket.on('get-pin-val', cores.getPin);
  });
};

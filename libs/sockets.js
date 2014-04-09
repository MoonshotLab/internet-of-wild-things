var cores = require('./cores');
var _ = require('lodash');

exports.init = function(io){
  io.sockets.on('connection', function(socket){
    socket.on('set-pin-val', cores.setPin);
    socket.on('get-pin-val', cores.getPin);
  });
};

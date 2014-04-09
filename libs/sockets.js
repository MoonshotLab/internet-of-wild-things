var cores = require('./cores');
var _ = require('lodash');

exports.init = function(io){
  io.sockets.on('connection', function(socket){
    socket.on('set-pin-val', setPinValue);
    socket.on('get-pin-val', getPinValue);
  });
};


var setPinValue = function(e){
  core.setPin(e.coreId, e.pinId, e.pinVal);
};


var getPinValue = function(e){
  core.getPin(e.coreId, e.pinId);
  console.log(e);
};

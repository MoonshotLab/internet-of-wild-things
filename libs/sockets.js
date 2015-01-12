var sparkModel = require('./spark-model');
var sparkCore = require('./spark-core');
var io = null;


exports.init = function(connector){
  io = connector;

  io.sockets.on('connection', function(socket){
    socket.on('set-pin-val', sparkCore.setPin);
    socket.on('get-pin-val', sparkCore.getPin);
    socket.on('create-webhook', sparkModel.createWebhook);
    socket.on('destroy-webhook', sparkModel.destroyWebhook);
    socket.on('set-pin-definitions', sparkCore.setPinDefinitions);
  });
};


exports.getIo = function(){
  return io;
};

var cores = require('./cores');
var io = null;

exports.connect = function(){
  var clients = cores.getClients();
  console.log(clients);
  clients.forEach(function(client){

    client.subscribe('input-update').on('update', function(e){

      // Convert stringed opts to JSON obj
      var opts = {coreId: e.coreid };
      try{
        var data = JSON.parse(e.data);
        opts.pinId = data.pinId;
        opts.state = data.state;
      } catch(e){
        if(e) console.log(e);
      }

      cores.callWebhook(opts);
      io.sockets.emit('input-update', opts);
    });
  });
};


exports.init = function(connector){
  io = connector;

  io.sockets.on('connection', function(socket){
    socket.on('set-pin-val', cores.setPin);
    socket.on('get-pin-val', cores.getPin);
    socket.on('create-webhook', cores.createWebhook);
    socket.on('destroy-webhook', cores.destroyWebhook);
    socket.on('set-pin-definitions', cores.setPinDefinitions);
  });
};


exports.getIo = function(){
  return io;
}

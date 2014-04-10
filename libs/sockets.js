var cores = require('./cores');
var _ = require('lodash');
var io = null;

cores.getClients().forEach(function(client){
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

    core.callWebhook(opts);
    io.sockets.emit('input-update', opts);
  });
});


exports.init = function(connector){
  io = connector;

  io.sockets.on('connection', function(socket){
    socket.on('set-pin-val', cores.setPin);
    socket.on('get-pin-val', cores.getPin);
    sockets.on('create-webhook', cores.setWebhook);
    sockets.on('destroy-webhook', cores.destroyWebhook);
  });
};

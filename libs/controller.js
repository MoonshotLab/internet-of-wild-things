var Spark = require('./spark');
var sparkClients = [];

var callWebhook = function(e){
  if(e.coreid) console.log(e);
};


exports.getClient = function(coreId, token){
  var sparkClient = null;

  sparkClients.forEach(function(client){
    if(client.opts.coreId === coreId) sparkClient = client;
  });

  if(sparkClient) return sparkClient
  else{
    sparkClient = Spark.createClient({
      coreId: coreId,
      token: token
    });

    sparkClient.subscribe('input-update')
      .on('update', callWebhook);

    sparkClients.push(sparkClient);
  }

  return sparkClient;
};


exports.setPin = function(pinId, client, context, next){
  client.setPin({
    pinId: pinId,
    value: context.params.pinVal
  }, function(err, res){
    if(next) next(err, res, context);
  });
};


exports.getPin = function(pinId, client, context, next){
  client.getPin({
    pinId: pinId
  }, function(err, res){
    if(next) next(err, res, context);
  });
};

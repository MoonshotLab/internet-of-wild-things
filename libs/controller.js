var Spark = require('./spark');
var needle = require('needle');
var sparkClients = [];


var callWebhook = function(e){

  var parsedJSON = null;
  try{ parsedJSON = JSON.parse(e.data) }
  catch(e){ console.log('error parsing json', e); }

  if(parsedJSON){
    var pinId = parsedJSON.pinId;
    var sparkClient = null;
    sparkClients.forEach(function(client){
      if(client.opts.coreId === e.coreid) sparkClient = client;
    });

    if(sparkClient){
      var webhookURL = sparkClient.opts.webhooks[pinId];
      if(webhookURL){
        needle.get(webhookURL, function(err, res){
          if(err)
            console.error('failed to call webhook', webhookURL, err);
          else
            console.log('called webhook', webhookURL);
        });
      }
    }
  }
};


var getClient = function(coreId, token){
  var sparkClient = null;

  sparkClients.forEach(function(client){
    if(client.opts.coreId === coreId) sparkClient = client;
  });

  if(sparkClient) return sparkClient
  else{
    sparkClient = Spark.createClient({
      coreId: coreId,
      token: token,
      webhooks: {}
    });

    sparkClient.subscribe('input-update')
      .on('update', callWebhook);

    sparkClients.push(sparkClient);
  }

  return sparkClient;
};


var setPin = function(pinId, client, context, next){
  client.setPin({
    pinId: pinId,
    value: context.params.pinVal
  }, function(err, res){
    if(res) res.webhooks = client.opts.webhooks;
    if(next) next(err, res, context);
  });
};


var getPin = function(pinId, client, context, next){
  client.getPin({
    pinId: pinId
  }, function(err, res){
    if(res) res.webhooks = client.opts.webhooks;
    if(next) next(err, res, context);
  });
};


var setWebhook = function(pinId, client, context, next){
  client.opts.webhooks[pinId] = context.params.webhook;
  getPin(pinId, client, context, next);
};


exports.getPin = getPin;
exports.setPin = setPin;
exports.getClient = getClient;
exports.setWebhook = setWebhook;

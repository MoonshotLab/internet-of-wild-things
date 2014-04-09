var needle = require('needle');
var Spark = require('./spark');
var config = require('../config');
var sparkClients = [];

config.cores.forEach(function(core){
  var sparkClient = Spark.createClient({
    coreId: core.coreId,
    token: core.accessToken,
    webhooks: {},
    color: core.color
  });

  sparkClients.push(sparkClient);
});


var findClient = function(coreId){
  return _.filter(sparkClients, function(client){
    if(client.opts.coreId == coreId) return client
  });
};


exports.getClients = function(){
  return sparkClients;
};


exports.setPin = function(opts, next){
  var sparkClient = findClient(opts.coreId);

  sparkClient.setPin({
    pinId: opts.pinId,
    value: opts.val
  }, function(err, res){
    if(next) next(err, res);
  });
};


exports.getPin = function(opts){
  var sparkClient = findClient(opts.coreId);

  client.getPin({
    pinId: opts.pinId
  }, function(err, res){
    if(res) res.webhooks = sparkClient.opts.webhooks;
    if(next) next(err, res);
  });
};


exports.setWebhook = function(opts, next){
  var sparkClient = findClient(opts.coreId);

  client.opts.webhooks[pinId] = opts.webhook;
  if(next) next();
};


// exports.callWebhook = function(e){
//
//   var parsedJSON = null;
//   try{ parsedJSON = JSON.parse(e.data); }
//   catch(err){ console.log('error parsing json', err); }
//
//   if(parsedJSON){
//     var pinId = parsedJSON.pinId;
//     var sparkClient = null;
//     sparkClients.forEach(function(client){
//       if(client.opts.coreId === e.coreid) sparkClient = client;
//     });
//
//     if(sparkClient){
//       var webhookURL = sparkClient.opts.webhooks[pinId];
//       if(webhookURL){
//         needle.get(webhookURL, function(err, res){
//           if(err)
//             console.error('failed to call webhook', webhookURL, err);
//           else
//             console.log('called webhook', webhookURL);
//         });
//       }
//     }
//   }
// };

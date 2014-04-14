var needle = require('needle');
var Spark = require('./spark');
var sockets = require('./sockets');
var sparkClients = [];


// Connect to the database, create the core clients
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(process.env.WILD_THANGS_DB_CONNECTOR, function(err, db){
  if(err) throw err;

  db.collection('cores').find().toArray(function(err, results){
    results.forEach(makeClient);
  });

  sockets.connect();
});


var makeClient = function(core){
  var sparkClient = Spark.createClient({
    coreId: core.coreId,
    token: core.accessToken,
    webhooks: {},
    color: core.color
  });

  sparkClients.push(sparkClient);
};


var findClient = function(coreId){
  var sparkClient = null;

  sparkClients.forEach(function(client){
    if(client.opts.coreId == coreId)
      sparkClient = client;
  });

  return sparkClient;
};


exports.getClients = function(){
  return sparkClients;
};


exports.setPin = function(opts, next){
  var sparkClient = findClient(opts.core.coreId);

  sparkClient.setPin({
    pinId: opts.pinId,
    value: opts.pinVal
  }, function(err, res){
    if(next) next(err, res);
  });
};


exports.getPin = function(opts, next){
  var sparkClient = findClient(opts.coreId);

  sparkClient.getPin({
    pinId: opts.pinId
  }, function(err, res){
    if(res) res.webhooks = sparkClient.opts.webhooks;
    if(next) next(err, res);
  });
};


exports.createWebhook = function(opts, next){
  var sparkClient = findClient(opts.coreId);
  sparkClient.opts.webhooks[opts.pinId] = opts.webhookUrl;
  if(next) next();
};


exports.destroyWebhook = function(opts, next){
  var sparkClient = findClient(opts.coreId);

  client.opts.webhooks[opts.pinId] = opts.webhook;
  if(next) next();
};


exports.callWebhook = function(opts, next){
  var sparkClient = findClient(opts.coreId);
  var webhookURL = sparkClient.opts.webhooks[opts.pinId];
  if(webhookURL){
    var formData = [
      'pinId=',
      opts.pinId,
      '&pinVal=',
      opts.pinVal
    ].join('');

    needle.post(webhookURL, formData, function(err, res){
      if(next) next(err, res);
    });
  }
};


exports.findById = findClient;

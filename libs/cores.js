// A record is the DB record, a client is the core object
// held in memory. The stuff in memory has all the events
// attached.

var needle = require('needle');
var Spark = require('./spark');
var sockets = require('./sockets');
var db = null;
var sparkClients = [];


// Connect to the database, create the core clients
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(process.env.WILD_THANGS_DB_CONNECTOR, function(err, client){
  if(err) throw err;
  db = client;

  db.collection('cores').find().toArray(function(err, results){
    results.forEach(makeClient);
  });

  sockets.connect();
});


var getRecord = function(coreId, next){
  db.collection('cores').find().toArray(function(err, records){
    records.forEach(function(record){
      if(record.coreId == coreId) next(record);
    });
  });
};


var makeClient = function(core){
  var sparkClient = Spark.createClient({
    id: core._id,
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
  getRecord(opts.coreId, function(record){
    var webhooks = record.webhooks;
    webhooks[opts.pinId] = opts.webhookUrl;

    db.collection('cores').update(
      { _id: record._id },
      { $set:
        {
          webhooks: webhooks
        }
      }, function(err, res){
        if(next) next(err, res);
    });
  });
};


exports.destroyWebhook = function(opts, next){
  getRecord(opts.coreId, function(record){
    var webhooks = record.webhooks;
    delete webhooks[opts.pinId];

    db.collection('cores').update(
      { _id: record._id },
      { $set:
        {
          webhooks: webhooks
        }
      }, function(err, res){
        if(next) next(err, res);
    });
  });
};


exports.callWebhook = function(opts, next){
  getRecord(opts.coreId, function(record){
    var webhookURL = record.webhooks[opts.pinId];

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
  });
};


exports.findById = findClient;
exports.getRecord = getRecord;

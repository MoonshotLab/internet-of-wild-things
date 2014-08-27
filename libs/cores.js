// A record is the DB record, a client is the core object
// held in memory. The stuff in memory has all the events
// attached.

var bootloader = require('./bootloader');
var needle = require('needle');
var Spark = require('./spark');
var sockets = require('./sockets');
var db = null;
var sparkClients = [];


// Connect to the database, create the core clients
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(process.env.DB_CONNECTOR, function(err, client){
  if(err) throw err;
  db = client;

  db.collection('cores').find().toArray(function(err, results){
    results.forEach(makeClient);
  });

  // UGHHHHHHHHHHHHH I don't know why THIS IS NEEDED!!!!?!?!
  setTimeout(function(){
    sockets.connect();
  }, 3000);

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
  var sparkClient = findClient(opts.coreId);

  sparkClient.setPin({
    pinId: opts.pinId,
    pinVal: opts.pinVal
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
  if(opts.state !== undefined) opts.pinVal = opts.state;

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


exports.setPinDefinitions = function(opts, next){
  getRecord(opts.coreId, function(record){
    db.collection('cores').update(
      { _id: record._id },
      { $set:
        {
          pins: opts.pins,
          analogThreshold: opts.analogThreshold
        }
      }, function(err, res){
        bootloader.generateCode({
          coreId: opts.coreId,
          pins: opts.pins,
          analogThreshold: opts.analogThreshold
        }, function(err, filePath){
          bootloader.flash({
            coreId: opts.coreId,
            filePath: filePath
          });
        });

        if(next) next(err, res);
    });
  });
};


exports.getColorById = function(coreId){
  var color = '';
  sparkClients.forEach(function(client){
    if(client.opts.coreId == coreId)
      color = client.opts.color;
  });

  return color;
};


exports.findById = findClient;
exports.getRecord = getRecord;

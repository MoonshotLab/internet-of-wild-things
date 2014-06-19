var Q = require('q');
var needle = require('needle');
var MongoClient = require('mongodb').MongoClient;
var collection = null;


var connect = function(){
  var deferred = Q.defer();

  MongoClient.connect(process.env.WILD_THANGS_DB_CONNECTOR, function(err, client){
    collection = client.collection('cores');
    deferred.resolve(collection);
  });

  return deferred.promise;
};


var getAll = function(){
  var deferred = Q.defer();

  collection.find().toArray(function(err, results){
    deferred.resolve(results);
  });

  return deferred.promise;
};


var getByCoreId = function(coreId){
  var deferred = Q.defer();

  collection.findOne({
    coreId: coreId,
  }, function(err, record){
    deferred.resolve(record);
  });

  return deferred.promise;
};


var createWebhook = function(opts){
  var deferred = Q.defer();

  var updateModel = function(model){
    var webhooks = model.webhooks;
    webhooks[opts.pinId] = opts.url;

    collection.findAndModify(
      { coredId: opts.coreId },
      [['_id','asc']],
      { $set: { webhooks: webhooks } },
    function(err, update){
      deferred.resolve(update);
    });
  };

  getByCoreId(opts.coreId).then(updateModel);
  return deferred.promise;
};


var destroyWebhook = function(opts){
  var deferred = Q.defer();

  var updateModel = function(model){
    var webhooks = model.webhooks;
    delete webhooks[opts.pinId];

    collection.findAndModify(
      { coredId: opts.coreId },
      [['_id','asc']],
      { $set: { webhooks: webhooks } },
    function(err, update){
      deferred.resolve(update);
    });
  };

  getByCoreId(opts.coreId).then(updateModel);
  return deferred.promise;
};


var setPins = function(opts){
  var deferred = Q.defer();

  collection.findAndModify(
    { coreId: opts.coreId },
    [['_id','asc']],
    { $set: { pins: opts.pins } },
  function(err, update, stats){
    deferred.resolve(update);
  });

  return deferred.promise;
};


var callWebhook = function(opts){
  getByCoreId(opts.coreId).then(function(record){
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


exports.connect = connect;
exports.getAll = getAll;
exports.setPins = setPins;
exports.getByCoreId = getByCoreId;
exports.destroyWebhook = destroyWebhook;
exports.createWebhook = createWebhook;
exports.callWebhook = callWebhook;

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
    console.log(results);
    deferred.resolve(results);
  });

  return deferred.promise;
};


var upsert = function(opts){
  var deferred = Q.defer();

  collection.update(
    { coredId: opts.id },
    { $set: opts },
    { upsert: true },

    function(err, record, stats){
      if(err) console.log('Upsert Error:', err);
      deferred.resolve(record);
    }
  );

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
  getByCoreId(opts.coreId)
    .then(function(model){
      var webhooks = model.webhooks;
      webhooks[opts.pinId] = opts.url;

      upsert({
        coreId: opts.coreId,
        webhooks: webhooks
      }).then(deferred.resolve);
    });
};


var destroyWebhook = function(opts){
  getByCoreId(opts.coreId)
    .then(function(model){
      var webhooks = model.webhooks;
      delete webhooks[opts.pinId];

      upsert({
        coreId: opts.coreId,
        webhooks: webhooks
      }).then(deferred.resolve);
    });
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
exports.getByCoreId = getByCoreId;
exports.upsert = upsert;
exports.destroyWebhook = destroyWebhook;
exports.createWebhook = createWebhook;
exports.callWebhook = callWebhook;

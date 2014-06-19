var Q = require('q');
var bootloader = require('./bootloader');
var spark = require('sparknode');
var needle = require('needle');
var sparkModel = require('./spark-model');
var sockets = require('./sockets');


var connectClients = function(models){
  console.log('\nConnecting spark clients...');
  models.forEach(connect);
};


var connect = function(model){
  var client = new spark.Core(
    process.env.SPARK_ACCESS_TOKEN,
    model.coreId,
    {}
  );

  client.on('connect', handleConnection);
  client.on('event', handleEvent);
  client.on('error', handleError);
};


var handleConnection = function(e){
  console.log('Spark connected:', e.name);
};


var handleError = function(err){
  console.log('Spark Core Error:', err);
};


var handleEvent = function(e){
  sparkModel.getColorById(e.data.coreid).then(function(color){
    console.log('Event:', color, e.data.data.pinId);
  });

  sparkModel.callWebhook({
    coreId: e.data.coreid,
    pinId: e.data.data.pinId
  });

  sockets.getIo().sockets.emit('input-update', e);
};


var getPin = function(opts){
  var deferred = Q.defer();

  var url = [
    'https://api.spark.io/v1/devices',
    opts.coreId,
    'getState'
  ].join('/');

  var params = {
    access_token: process.env.SPARK_ACCESS_TOKEN,
    params: opts.pinId
  };

  needle.post(url, params, function(err, res, body){
    deferred.resolve(body);
  });

  return deferred.promise;
};


var setPin = function(opts){
  var deferred = Q.defer();

  var url = [
    'https://api.spark.io/v1/devices',
    opts.coreId,
    'setState'
  ].join('/');

  var params = {
    access_token: process.env.SPARK_ACCESS_TOKEN,
    params: opts.pinId + ',' + opts.pinVal
  };

  needle.post(url, params, function(err, res, body){
    if(err) console.log(err);
    deferred.resolve(body);
  });

  return deferred.promise;
};


var setPinDefinitions = function(opts){
  sparkModel.setPins(opts)
    .then(bootloader.generateCode)
    .then(function(filePath){
      bootloader.flash({
        coreId: opts.coreId,
        filePath: filePath
      });
    })
    .then(function(){
      sockets.getIo().sockets.emit('flash-complete', {
        coreId: opts.coreId
      });
    });
};


exports.connectClients = connectClients;
exports.getPin = getPin;
exports.setPin = setPin;
exports.setPinDefinitions = setPinDefinitions;

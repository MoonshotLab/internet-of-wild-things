var Q = require('q');
var bootloader = require('./bootloader');
var spark = require('sparknode');
var sparkModel = require('./spark-model');
var sockets = require('./sockets');


var connectClients = function(models){
  console.log('\nConnecting spark clients...');
  models.forEach(connect);
  console.log('\n');
};


var connect = function(model){
  var client = new spark.Core(
    process.env.SPARK_ACCESS_TOKEN,
    model.coreId,
    {}
  );

  client.on('connect', function(){
    console.log('connected', model.color);
  });

  client.on('iot-update', newEvent);
  client.on('error', handleError);
};


var handleError = function(err){
  console.log('Spark Core Error:', err);
};


var newEvent = function(e){
  sparkModel.callWebhook({
    coreId: e.coreId,
    pinId: e.data.pinId
  });

  sockets.getIo().emit('input-update', opts);
};


var getPin = function(opts){
  var deferred = Q.defer();

  var url = [
    'https://api.spark.io/v1/devices/',
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
    'https://api.spark.io/v1/devices/',
    opts.coreId,
    'setState'
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


var setPinDefinitions = function(opts){
  sparkModel.upsert(opts)
    .then(bootloader.generateCode)
    .then(bootloader.flash)
    .then(function(){
      sockets.getIo().emit('flash-complete', opts.coreId);
    });
};


exports.connectClients = connectClients;
exports.getPin = getPin;
exports.setPin = setPin;
exports.setPinDefinitions = setPinDefinitions;

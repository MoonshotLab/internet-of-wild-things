var path = require('path');
var EE = require('events').EventEmitter;
var needle = require('needle');
var extend = require('xtend');
var SparkApi = require(
  '../node_modules/spark-cli/lib/ApiClient'
);


var Client = function(opts){
  if(!opts) opts = {};
  this.opts = opts;
  this.baseURL = [
    'https://api.spark.io/v1/devices/',
    this.opts.coreId
  ].join('');

  return this;
};


Client.prototype.getPin = function(opts, next){
  var url = this.baseURL + '/getState';
  var params = {
    access_token: process.env.SPARK_ACCESS_TOKEN,
    params: opts.pinId
  };

  needle.post(url, params, function(err, res, body){
    if(err) console.log(err);
    if(next) next(err, body);
  });
};


Client.prototype.setPin = function(opts, next){
  var url = this.baseURL + '/setState';
  var params = {
    access_token: process.env.SPARK_ACCESS_TOKEN,
    params: opts.pinId + ',' + opts.pinVal
  };

  needle.post(url, params, function(err, res, body){
    if(err) console.log(err);
    if(next) next(err, body);
  });
};


Client.prototype.subscribe = function(eventName){
  if(eventName) this.opts.eventName = eventName;
  var emitter = new EE();

  var onData = function(event) {
    var chunk = event.toString();
    appendToQueue(chunk.split("\n"));
  };

  var chunks = [];
  var appendToQueue = function(arr) {
    for(var i=0;i<arr.length;i++){
      var line = (arr[i] || "").trim();
      if(line === "") continue;

      chunks.push(line);
      if(line.indexOf("data:") === 0) {
        processItem(chunks);
        chunks = [];
      }
    }
  };

  var processItem = function(arr) {
    var obj = {};
    for(var i=0;i<arr.length;i++) {
      var line = arr[i];

      if(line.indexOf("event:") === 0) {
        obj.name = line.replace("event:", "").trim();
      }
      else if(line.indexOf("data:") === 0) {
        line = line.replace("data:", "");
        obj = extend(obj, JSON.parse(line));
      }
    }

    emitter.emit('update', obj);
  };


  new SparkApi(
    'https://api.spark.io',
    this.opts.token
  ).getEventStream(
    this.opts.eventName,
    this.opts.coreId,
    onData
  );

  return emitter;
};


exports.createClient = function(opts){
  return new Client(opts);
};

var EE = require('events').EventEmitter;
var extend = require('xtend');
var SparkApi = require(
  '../node_modules/spark-cli/lib/ApiClient'
);


var Client = function(opts){
  if(!opts) opts = {};
  this.opts = opts;
};


exports.createClient = function(opts){
  return new Client(opts);
};


Client.prototype.subscribe = function(){
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

    emitter.emit('update', JSON.stringify(obj));
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

var twitter = require('ntwitter');
var EE = require('events').EventEmitter;

var Client = function(opts){
  this.opts = opts;

  this.connection = new twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
};


Client.prototype.subscribe = function(){
  var emitter = new EE();
  var opts = this.opts;

  this.connection.stream('statuses/filter',
    { track: opts.term },
    function(stream){
      stream.on('data', function(data){
        emitter.emit('update', data);
      });
    }
  );

  return emitter;
};


Client.prototype.verifyCreds = function(){
  this.connection.verifyCredentials(function(err, data){
    if(err) console.error('error', err);
    else console.log(data);
  });
};


exports.createClient = function(opts){
  return new Client(opts);
};

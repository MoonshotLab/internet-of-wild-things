var twitter = require('ntwitter');
var Spark = require('./spark');
var sparkClient = Spark.createClient({
  coreId: process.env.SPARK_CORE_ID,
  token: process.env.SPARK_CORE_TOKEN
});

var twit = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var handleUpdates = function(e){
  var modifyPin = function(newState){
    client.setPin({
      pinId: 'D0',
      value: newState
    });
  };

  if(e.text){
    if(e.text.indexOf('#off') != -1) modifyPin(0);
    else modifyPin(1);
  }
};


twit.stream('statuses/filter',
  { track: '@_joelongstreet' },
  function(stream){
    stream.on('data', function(data){
      emitter.emit('update', data);
    });
  }
);

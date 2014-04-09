var port = process.env.PORT || 3000;
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser());

app.listen(port);
console.log('server listening on', port);


var Spark = require('./libs/spark');
var sparkClient = Spark.createClient({
  coreId: process.env.SPARK_CORE_ID,
  token: process.env.SPARK_CORE_TOKEN
});


// Listen for Tweets
var twitter = require('./libs/twitter');
var tweetClient = twitter.createClient({
  term: '@_joelongstreet'
});

tweetClient.subscribe().on('update', function(e){
  var modifyPin = function(newState){
    client.setPin({
      pinId: 'D0',
      value: newState
    });
  };

  if(e.text){
    if(e.text.indexOf('#off') != -1){
      modifyPinState(0);
    } else{
      modifyPinState(1);
    }
  }
});

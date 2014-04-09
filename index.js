var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

app.set('port', process.env.PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

app.listen(port);
console.log('server listening on', port);


var routes = require('./libs/routes');
app.get('/core/:color', routes.core);
app.get('/core/:color/watch-inputs', routes.watchInputs);
app.get('/core/:color/control-outputs', routes.controlOutputs);


// var Spark = require('./libs/spark');
// var sparkClient = Spark.createClient({
//   coreId: process.env.SPARK_CORE_ID,
//   token: process.env.SPARK_CORE_TOKEN
// });
//
//
// // Listen for Tweets
// var twitter = require('./libs/twitter');
// var tweetClient = twitter.createClient({
//   term: '@_joelongstreet'
// });
//
// tweetClient.subscribe().on('update', function(e){
//   var modifyPin = function(newState){
//     client.setPin({
//       pinId: 'D0',
//       value: newState
//     });
//   };
//
//   if(e.text){
//     if(e.text.indexOf('#off') != -1){
//       modifyPinState(0);
//     } else{
//       modifyPinState(1);
//     }
//   }
// });

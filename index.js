var http = require('http');
var express = require('express');
var sockets = require('./libs/sockets');
var sparkModel = require('./libs/spark-model');

var port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.set('log level', 1);

app.set('port', process.env.PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// app.use(express.logger('tiny'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));


var routes = require('./libs/routes');
app.get('/', routes.home);
app.get('/core/:id', sparkModel.getByCoreId, routes.core);
app.get('/core/:id/watch-inputs', routes.watchInputs);
app.get('/core/:id/control-outputs', routes.controlOutputs);
app.get('/core/:id/setPin', routes.setPin);
app.get('/core/:id/hook', routes.callHook);
app.get('/core/:id/webhooks', routes.webhooks);


sockets.init(io);
server.listen(port);
console.log('server listening on', port);


var getSparkModel = function(req, res, next){
  sparkModel.getByCoreId(req.params.id).then(function(core){
    req.core = core;
    if(next) next();
  })
};

var Pathways = require('pathways');
var http = require('http');
var routes = require('./libs/routes');

var pathways = Pathways();
var server = http.createServer(pathways);

pathways
  .get('/', routes.home)
  .get('/getPin/:id', routes.getPin)
  .get('/setPin/:id/:val', routes.setPin);

var port = process.env.PORT || 3000;
server.listen(port);

console.log('Server now listening on', port);

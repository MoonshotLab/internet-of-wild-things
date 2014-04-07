var Pathways = require('pathways');
var http = require('http');
var Spark = require('./libs/spark');

var pathways = Pathways();
var server = http.createServer(pathways);
var sparkClient = Spark.createClient({
  coreId: process.env.SPARK_CORE_ID,
  token: process.env.SPARK_CORE_TOKEN
});

var sparkEvents = sparkClient.subscribe();
sparkEvents.on('update', function(e){
  console.log(e);
});

pathways
  .get('/', function(){
    this.response.writeHead(200,
      { 'Content-Type': 'text/html' }
    );

    this.response.write('App connected...');
    this.response.end();
  })

  .get('/getPin/:id', function(id){
    var self = this;
    sparkClient.getPin({
      pinId: id
    }, function(err, res){
      routeCallback(err, res, self);
    });
  })

  .get('/setPin/:id/:val', function(id, val){
    var self = this;
    sparkClient.setPin({
      pinId: id,
      value: val
    }, function(err, res){
      routeCallback(err, res, self);
    });
  });


var routeCallback = function(err, res, context){
  context.response.writeHead(200,
    { 'Content-Type': 'text/json' }
  );

  if(err) context.response.write(JSON.stringify(err));
  else context.response.write(JSON.stringify(res));

  context.response.end();
};

server.listen(3000);

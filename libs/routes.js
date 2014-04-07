var Spark = require('./spark');
var sparkClients = [];


var jsonResponder = function(err, res, context){
  context.response.writeHead(200,
    { 'Content-Type': 'text/json' }
  );

  if(err) context.response.write(JSON.stringify(err));
  else context.response.write(JSON.stringify(res));

  context.response.end();
};


var retrieveClient = function(coreId, token){
  var sparkClient = null;

  sparkClients.forEach(function(client){
    if(client.opts.coreId === coreId) sparkClient = client;
  });

  if(sparkClient) return sparkClient
  else{
    sparkClient = Spark.createClient({
      coreId: coreId,
      token: token
    });

    sparkClient.subscribe().on('update', function(e){
      console.log(e);
    });

    sparkClients.push(sparkClient);
  }

  return sparkClient;
};


exports.home = function(){
  this.response.writeHead(200,
    { 'Content-Type': 'text/html' }
  );

  this.response.write('App connected...');
  this.response.end();
};


exports.getPin = function(coreId, pinId){
  var context = this;
  var client = retrieveClient(coreId, context.params.accessToken);

  client.getPin({
    pinId: pinId
  }, function(err, res){
    jsonResponder(err, res, context);
  });
};


exports.setPin = function(coreId, pinId, pinVal){
  var context = this;
  var client = retrieveClient(coreId, context.params.accessToken);

  client.setPin({
    pinId: pinId,
    value: pinVal
  }, function(err, res){
    jsonResponder(err, res, context);
  });
};

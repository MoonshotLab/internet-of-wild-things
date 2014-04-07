var Spark = require('./spark');
var sparkClient = Spark.createClient({
  coreId: process.env.SPARK_CORE_ID,
  token: process.env.SPARK_CORE_TOKEN
});

var sparkEvents = sparkClient.subscribe();
sparkEvents.on('update', function(e){
  console.log(e);
});


var jsonResponder = function(err, res, context){
  context.response.writeHead(200,
    { 'Content-Type': 'text/json' }
  );

  if(err) context.response.write(JSON.stringify(err));
  else context.response.write(JSON.stringify(res));

  context.response.end();
};


exports.home = function(){
  this.response.writeHead(200,
    { 'Content-Type': 'text/html' }
  );

  this.response.write('App connected...');
  this.response.end();
};


exports.getPin = function(id){
  var self = this;
  sparkClient.getPin({
    pinId: id
  }, function(err, res){
    jsonResponder(err, res, self);
  });
};


exports.setPin = function(id, val){
  var self = this;
  sparkClient.setPin({
    pinId: id,
    value: val
  }, function(err, res){
    jsonResponder(err, res, self);
  });
};

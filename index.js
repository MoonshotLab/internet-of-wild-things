var Spark = require('./libs/spark');
var sparkClient = Spark.createClient({
  coreId: process.env.SPARK_CORE_ID,
  token: process.env.SPARK_CORE_TOKEN
});

var sparkEvents = sparkClient.subscribe();

sparkEvents.on('update', function(e){
  console.log(e);
});

sparkClient.getPin({
  pinId: 'D0'
}, function(err, res){
  if(err) console.log(err);
  console.log(res);
});

sparkClient.setPin({
  pinId: 'D2',
  value: 0
}, function(err, res){
  if(err) console.log(err);
  console.log(res);
});

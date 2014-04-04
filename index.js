var Spark = require('./libs/spark');
var sparkClient = Spark.createClient({
  token: process.env.SPARK_CORE_TOKEN
});

var sparkEvents = sparkClient.subscribe();

sparkEvents.on('update', function(e){
  console.log(e);
});

setInterval(function(){}, 1000);

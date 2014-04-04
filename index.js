var spark = require('./libs/spark');
var sparkEvents = spark.events({
  token: process.env.SPARK_CORE_TOKEN
});

sparkEvents.on('update', function(e){
  console.log(e);
});

setInterval(function(){}, 1000);

var fs = require('fs');
var crypto = require('crypto');
var sockets = require('./sockets');
var SparkApi = require(
  '../node_modules/spark-cli/lib/ApiClient'
);


exports.generateCode = function(opts, next){
  opts.analogChangeThreshold = 5;

  fs.readFile('./duino/template.c', 'utf8', function(err, data){
    var fileContents = replaceKeysWithProperties(opts, data);
    var currentDate = new Date().valueOf().toString();
    var fileName = crypto.createHash('sha1')
      .update(currentDate + opts.coreId)
      .digest('hex') + '.ino';
    var filePath = './duino/generated/' + fileName;
    fs.writeFile(
      filePath, fileContents, 'utf8',
      function(error, data){
        if(next) next(err, filePath);
      }
    );
  });
};


exports.flash = function(opts){
  var client = new SparkApi(
    'https://api.spark.io',
    opts.accessToken
  );

  var obj = {};
  obj[opts.filePath] = opts.filePath;
  client.flashCore(opts.coreId, obj).then(function(){
    sockets.getIo().sockets.emit('flash-complete', {
      coreId: opts.coreId
    });
  });
};


var replaceKeysWithProperties = function(opts, blob){
  var digitalOutputs = [];
  var digitalInputs = [];
  var analogOutputs = [];
  var analogInputs = [];

  for(var key in opts.pins){
    if(opts.pins[key] == 'output' && key.indexOf('D') != -1)
      digitalOutputs.push(key);
    else if(opts.pins[key] == 'input' && key.indexOf('D') != -1)
      digitalInputs.push(key);
    else if(opts.pins[key] == 'output' && key.indexOf('A') != -1)
      analogOutputs.push(key);
    else if(opts.pins[key] == 'input' && key.indexOf('A') != -1)
      analogInputs.push(key);
  }

  blob = blob.replace('¡¡digitalInputs¡¡',
    '{' + digitalInputs.join(',') + '}'
  );

  blob = blob.replace('¡¡digitalOutputs¡¡',
    '{' + digitalOutputs.join(',') + '}'
  );

  blob = blob.replace('¡¡analogInputs¡¡',
    '{' + analogInputs.join(',') + '}'
  );

  blob = blob.replace('¡¡analogOutputs¡¡',
    '{' + analogOutputs.join(',') + '}'
  );

  blob = blob.replace('¡¡analogChangeThreshold¡¡',
     opts.analogChangeThreshold
  );

  return blob;
};

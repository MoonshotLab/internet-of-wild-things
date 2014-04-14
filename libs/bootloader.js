var fs = require('fs');
var crypto = require('crypto');
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
    // TODO - Reply with socket...
  });
};


var replaceKeysWithProperties = function(opts, blob){
  blob = blob.replace('¡¡digitalInputs¡¡',
    '{' + opts.digitalInputs.join(',') + '}'
  );

  blob = blob.replace('¡¡digitalOutputs¡¡',
    '{' + opts.digitalInputs.join(',') + '}'
  );

  blob = blob.replace('¡¡analogInputs¡¡',
    '{' + opts.analogInputs.join(',') + '}'
  );

  blob = blob.replace('¡¡analogOutputs¡¡',
    '{' + opts.analogOutputs.join(',') + '}'
  );

  blob = blob.replace('¡¡analogChangeThreshold¡¡',
     opts.analogChangeThreshold
  );

  return blob;
};

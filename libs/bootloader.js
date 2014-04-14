var fs = require('fs');

exports.generateCode = function(opts, next){
  opts.analogChangeThreshold = 5;

  fs.readFile('./duino/template.c', 'utf8', function(err, data){
    var fileContents = replaceKeysWithProperties(opts, data);
    console.log(fileContents);
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

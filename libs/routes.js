var cores = require('./cores');

var findCore = function(id){
  var core = cores.findById(id);
  return core.opts || {};
};

exports.home = function(req, res){
  res.render('index', { cores: cores.getClients() });
};

exports.core = function(req, res){
  cores.getRecord(req.params.id, function(record){
    res.render('core', { core: record });
  });
};

exports.controlOutputs = function(req, res){
  var core = findCore(req.params.id);
  res.render('control-outputs', { core: core });
};

exports.watchInputs = function(req, res){
  var core = findCore(req.params.id);
  res.render('watch-inputs', { core: core });
};


// exports.pin = function(coreId, pinId){
//   var responder = function(err, res, context){
//     context.response.writeHead(200,
//       { 'Content-Type': 'text/json' }
//     );
//
//     if(err) context.response.write(JSON.stringify(err));
//     else context.response.write(JSON.stringify(res));
//
//     context.response.end();
//   };
//
//   var context = this;
//   var client = controller.getClient(coreId, context.params.accessToken);
//
//   if(!pinId)
//     responder({ error: 'You must specify a pin id' }, {}, context);
//   else if(!this.params.accessToken)
//     responder({ error: 'You must specify an access token' }, {}, context);
//   else{
//     if(this.params.pinVal)
//       controller.setPin(pinId, client, context, responder);
//     else if(this.params.webhook)
//       controller.setWebhook(pinId, client, context, responder);
//     else
//       controller.getPin(pinId, client, context, responder);
//   }
// };

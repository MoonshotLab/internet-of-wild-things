var controller = require('./controller');

var responder = function(err, res, context){
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


exports.pin = function(coreId, pinId){
  var context = this;
  var client = controller.getClient(coreId, context.params.accessToken);

  if(!pinId)
    responder({ error: 'You must specify a pin id'}, context);
  else if(!this.params.accessToken)
    responder({ error: 'You must specify an access token'}, context);
  else{
    if(this.params.pinVal)
      controller.setPin(pinId, client, context, responder);
    else if(this.params.webhook)
      controller.setWebhook(pinId, client, context, responder);
    else
      controller.getPin(pinId, client, context, responder);
  }
};

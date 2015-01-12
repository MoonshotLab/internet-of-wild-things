var sparkModel = require('./spark-model');

exports.home = function(req, res){
  sparkModel.getAll().then(function(models){
    res.render('index', { cores: models });
  });
};

exports.core = function(req, res){
  res.render('core', {
    core: req.core,
    activeNav: 'core'
  });
};

exports.controlOutputs = function(req, res){
  res.render('control-outputs', {
    core: req.core,
    activeNav: 'control-outputs'
  });
};

exports.watchInputs = function(req, res){
  res.render('watch-inputs', {
    core: req.core,
    activeNav: 'watch-inputs'
  });
};

exports.webhooks = function(req, res){
  res.render('webhooks', {
    core: req.core,
    activeNav: 'webhooks'
  });
};

exports.setPin = function(req, res){
  cores.setPin({
    coreId: req.params.id,
    pinId: req.query.pinId,
    pinVal: req.query.pinVal
  });

  res.json({ok: true});
};

exports.callHook = function(req, res){
  cores.callWebhook({
    coreId: req.params.id,
    pinId: req.query.pinId,
    pinVal: req.query.pinVal
  }, function(err, body){
    if(err) res.json({ error: err });
    else res.json({ ok: true });
  })
};

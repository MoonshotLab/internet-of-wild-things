var cores = require('./cores');

exports.home = function(req, res){
  res.render('index', { cores: cores.getClients() });
};

exports.core = function(req, res){
  cores.getRecord(req.params.id, function(record){
    res.render('core', {
      core: record,
      activeNav: 'core'
    });
  });
};

exports.controlOutputs = function(req, res){
  cores.getRecord(req.params.id, function(record){
    res.render('control-outputs', {
      core: record,
      activeNav: 'control-outputs'
    });
  });
};

exports.watchInputs = function(req, res){
  cores.getRecord(req.params.id, function(record){
    res.render('watch-inputs', {
      core: record,
      activeNav: 'watch-inputs'
    });
  });
};

exports.webhooks = function(req, res){
  cores.getRecord(req.params.id, function(record){
    res.render('webhooks', {
      core: record,
      activeNav: 'webhooks'
    });
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

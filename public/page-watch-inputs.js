$(function(){

  // Listen for updates
  socket.on('input-update', function(opts){
    if(opts.coreId == core.coreId){
      $('#' + opts.pinId).text(opts.state);
    }
  });
});

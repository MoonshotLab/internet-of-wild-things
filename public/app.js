var socket = io.connect('/');

$(function(){

  // Page - Control Outputs
  $('#led-on').click(function(){
    socket.emit('set-pin-val', {
      core: core,
      pinId: 'D0',
      pinVal: 1
    });
  });

  $('#led-off').click(function(){
    socket.emit('set-pin-val', {
      core: core,
      pinId: 'D0',
      pinVal: 0
    });
  });

  $('#servo-move').click(function(){
    socket.emit('set-pin-val', {
      core: core,
      pinId: 'A0',
      pinVal: $('#servo-input').val()
    });
  });


  // // Oage - Watch Inputs
  // socket.on('pin-update', function(data){
  //   if(data.core.coreId == core.coreId){
  //     if(data.pinVal)
  //   }
  // });
});

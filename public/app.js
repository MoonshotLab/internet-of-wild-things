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


  // Page - Watch Inputs
  socket.on('input-update', function(e){
    if(e.coreid == core.coreId){

      var data = {};
      try{
        data = JSON.parse(e.data);
      } catch(e){
        if(e) console.log(e);
      }

      $('#' + data.pinId).text(data.state);
    }
  });
});

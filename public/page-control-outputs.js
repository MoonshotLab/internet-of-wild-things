$(function(){

  // Handle digital cases
  $('.btn.digital-pin').click(function(){
    var pinId = $(this).data('pinId');
    var pinVal = $(this).data('pinVal');
    socket.emit('set-pin-val', {
      core: core.coreId,
      pinId: pinId,
      pinVal: pinVal
    });
  });


  // Handle analog cases
  var setAnalogVal = function(){
    var $input = $(this).parent().parent().find('input')
    var pinId = $input.data('pinId');
    var pinVal = $input.val();
    socket.emit('set-pin-val', {
      coreId: core.coreId,
      pinId: pinId,
      pinVal: pinVal
    });
  };

  $('.analog-input').keyup(function(e){
    if(e.keyCode == 13) setAnalogVal();
  })
  $('.btn.analog-pin').click(setAnalogVal);

});

$(function(){

  // Handle digital cases
  $('.btn.digital-pin').click(function(){
    var pinId = $(this).data('pinid');
    var pinVal = $(this).data('pinval');
    socket.emit('set-pin-val', {
      coreId: core.coreId,
      pinId: pinId,
      pinVal: pinVal
    });
  });


  // Handle analog cases
  var setAnalogVal = function($context){
    var $input = $context.parent().parent().find('input')
    var pinId = $input.data('pinid');
    var pinVal = $input.val();

    socket.emit('set-pin-val', {
      coreId: core.coreId,
      pinId: pinId,
      pinVal: pinVal
    });
  };

  $('.analog-input').keyup(function(e){
    if(e.keyCode == 13)
      setAnalogVal($(this).parent().find('button'));
  })
  $('.btn.analog-pin').click(function(){
    setAnalogVal($(this));
  });

});

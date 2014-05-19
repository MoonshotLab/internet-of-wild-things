$(function(){

  // Setup Pins
  for(var key in core.pins){
    if(core.pins[key] == 'output')
      $('#' + key + '-radio-output').attr('checked', 'checked');
    else if(core.pins[key] == 'input')
      $('#' + key + '-radio-input').attr('checked', 'checked');
    else
      $('#' + key + '-radio-null').attr('checked', 'checked');
  }


  // Flash the Core
  $('#flash-core').click(function(e){
    e.preventDefault();
    var pins = {};
    $('#pin-definitions').find('tr').each(function(){
      var pinId = $(this).data('pinid');
      var pinSetting = $('input[name=' + pinId +'-radio]:checked').val();
      if(pinSetting == "unused") pinSetting = null;
      pins[pinId] = pinSetting;
    });

    socket.emit('set-pin-definitions', {
      coreId: core.coreId,
      analogThreshold: $('#analog-threshold').val(),
      pins: pins
    });
  });


  // Reset Pins
  $('#reset').click(function(e){
    e.preventDefault();
    $('#pin-definitions').find('tr').each(function(){
      var $radios = $(this).find('input');
      $radios.filter('[value=unused]').prop('checked', true);
    });
  });

});

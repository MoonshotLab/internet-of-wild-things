$(function(){

  // Publish Hooks
  var setupPublishHook = function(){
    var url = $('#publish-hook-input').val();
    var pinId = $('#publish-hook-pin').val();
    if(!url) alert('Please add a URL');
    else{
      socket.emit('create-webhook', {
        coreId: core.coreId,
        pinId: pinId,
        webhookUrl: url
      });

      var template = [
        "<li class='list-group-item'>",
          pinId,
          " - ",
          url,
          "<a class='delete-hook' href='#' data-pinid='" + pinId + "'>",
            "&times;",
          "</a>",
        "</li>"
      ].join('');

      $('#publish-hooks-list').append(template);
    }
  };
  $('#publish-hook-button').click(setupPublishHook);
  $('#publish-hook-input').keyup(function(e){
    if(e.keyCode == 13) setupPublishHook();
  });


  // Accept Hooks
  var setupAcceptHook = function(){
    var pinVal = $('#accept-hook-input').val();
    var pinId = $('#accept-hook-pin').val();
    if(!pinVal) alert('Please add an input value');
    else{

      var template = [
        "<div class='alert alert-info'>",
          "<p>Paste this URL into the Zapier interface, make sure to select 'GET'</p>",
          "<strong>",
            "http://wild-thangs.herokuapp.com/core/",
            core.coreId,
            "/setPin",
            "?pinId=",
            pinId,
            "&pinVal=",
            pinVal,
          "</strong>",
        "</div>"
      ].join('');

      $('#accept-hook-notifier').html(template);
    }
  };
  $('#accept-hook-button').click(setupAcceptHook);
  $('#accept-hook-input').keyup(function(e){
    if(e.keyCode == 13) setupAcceptHook();
  });


  // Flash Core and setup pins
  for(var key in core.pins){
    if(core.pins[key] == 'output')
      $('#' + key + '-radio-output').attr('checked', 'checked');
    else if(core.pins[key] == 'input')
      $('#' + key + '-radio-input').attr('checked', 'checked');
    else
      $('#' + key + '-radio-null').attr('checked', 'checked');
  }

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
      accessToken: core.accessToken,
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

  // Delete Hook
  $('ul#publish-hooks-list').click(function(e){
    e.preventDefault();
    var $target = $(e.target);
    if($target[0].tagName == 'A'){
      var pinId = $target.data('pinid');
      socket.emit('destroy-webhook', {
        coreId: core.coreId,
        pinId: pinId
      });
      $target.parent().remove();
    }
  });

});

var socket = io.connect('/');

$(function(){
  // Page - Core
  if($('.container.main').hasClass('page-core')){

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
          "</li>"
        ].join('');

        $('#publish-hooks-list').append(template);
      }
    };

    $('#publish-hook-input').keyup(function(e){
      if(e.keyCode == 13) setupPublishHook();
    });
    $('#publish-hook-button').click(setupPublishHook);


    // Accept Hooks
    var setupAcceptHook = function(){
      var pinVal = $('#accept-hook-input').val();
      var pinId = $('#accept-hook-pin').val();
      if(!pinVal) alert('Please add an input value');
      else{

        var template = [
          "<div class='alert alert-info'>",
            "<p>Paste this URL into the Zapier interface</p>",
            "<strong>",
              "http://wild-thangs.herokuapp.com/core/",
              core.coreId,
              "/",
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


    // Flash Core, setup pins
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
        core: core,
        pins: pins
      });
    });
  }


  // Page - Control Outputs
  if($('.container.main').hasClass('page-control-outputs')){

    $('.btn.digital-pin').click(function(){
      var pinId = $(this).data('pinId');
      var pinVal = $(this).data('pinVal');
      socket.emit('set-pin-val', {
        core: core,
        pinId: pinId,
        pinVal: pinVal
      });
    });

    $('.analog-input').keyup(function(e){
      if(e.keyCode == 13) setAnalogVal();
    })
    $('.btn.analog-pin').click(function(){
      setAnalogVal();
    });

    var setAnalogVal = function(){
      var $input = $(this).parent().parent().find('input')
      var pinId = $input.data('pinId');
      var pinVal = $input.val();
      socket.emit('set-pin-val', {
        core: core,
        pinId: pinId,
        pinVal: pinVal
      });
    };
  }


  // Page - Watch Inputs
  if($('.container.main').hasClass('page-watch-inputs')){
    socket.on('input-update', function(opts){
      if(opts.coreId == core.coreId){
        $('#' + opts.pinId).text(opts.state);
      }
    });
  }
});

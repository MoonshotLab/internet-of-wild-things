var socket = io.connect('/');

$(function(){
  // Page - Core
  if($('.container.main').hasClass('page-core')){
    $('#add-webhook').click(function(){
      var url = $('#webhook-input').val();
      var pinId = $('#webhook-pin').val();
      if(!url) alert('Add a URL');
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

        $('#hooks-list').append(template);
      }
    });
  }


  // Page - Control Outputs
  if($('.container.main').hasClass('page-control-outputs')){

    $('#d0-on').click(function(){
      socket.emit('set-pin-val', {
        core: core,
        pinId: 'D0',
        pinVal: 1
      });
    });

    $('#d0-off').click(function(){
      socket.emit('set-pin-val', {
        core: core,
        pinId: 'D0',
        pinVal: 0
      });
    });

    $('#a0-button').click(setA0Val);
    $('#a0-input').keydown(function(e){
      if(e.keyCode == 13) setA0Val();
    });

    var setA0Val = function(){
      socket.emit('set-pin-val', {
        core: core,
        pinId: 'A0',
        pinVal: $('#a0-input').val()
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

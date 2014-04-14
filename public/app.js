var socket = io.connect('/');

$(function(){
  // Page - Core
  if($('.container.main').hasClass('page-core')){
    $('#publish-hook-button').click(function(){
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
    });


    $('#accept-hook-button').click(function(){
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

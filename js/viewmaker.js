(function() {
  window.ViewMaker = {
    make: function(cmd, config) {
      // CONFIG MUST BE AN OBJECT (USUALLY WITH A NAME)
      if (!_.isObject(config)) {
        $newElement = $('div', {html: '[ViewMaker] Config for ' + cmd + ' should be an object'});
        return $newElement;
      }

      // +++++++++++++++++++++++++++++++++++
      var command = cmd.toLowerCase();
      if (command == 'plbutton' || command == 'peoplegroupbutton' || command == 'rdioaction') {
      //
      // CONFIG USING ANYTHING WITH A NAME PROPERTY
      // +++++++++++++++++++++++++++++++++++

        var $newElement = $('<div />', {
          'class': 'button',
          'html': config.name,
        });

      // +++++++++++++++++++++++++++++++++++
      } else if (command == 'person') {
      //
      // CONFIG WITH AN RDIO USER
      // +++++++++++++++++++++++++++++++++++

        var $newElement = $('<div />', {
          'id': config.key,
          'class': 'button',
          'html': config.username,
          'style':'background-image: url("' + config.icon + '")'
        });

      // +++++++++++++++++++++++++++++++++++
      } else if (command =='viewbox') {
      //
      // CONFIG WITH AN RDIO PLAYLIST
      // +++++++++++++++++++++++++++++++++++

        var playlistName = config.name || 'No Title';
        var $newElement = $('<div />', {
          'html': '<div class="showcase">'
                    +'<div class="albumtitle"></div>'
                    +'<div class="caseleft"><div class="caseart"></div></div>'
                    +'<div class="caseright"></div>'
                    +'<div class="casecommands"></div></div>'
                  +'<div class="listtitle">' + playlistName + '</div>'
                  +'<div class="albumgrid"></div>'
        });

      // +++++++++++++++++++++++++++++++++++
      } else if (command == 'albumthumb') {
      // 
      // CONFIG WITH AN RDIO ALBUM OBJECT
      // +++++++++++++++++++++++++++++++++++

        $newElement = $('<div />', {
          'class': 'button',
          'id': config.albumKey || config.key,
          'style': 'background-image: url(' +config.icon + ')'
        });

      // +++++++++++++++++++++++++++++++++++
      } else if (command == 'track') {
      //
      // CONFIG WITH AN RDIO TRACK OBJECT
      // +++++++++++++++++++++++++++++++++++

        var _name = config.name.replace(/\(/g, '<span>').replace(/\)/g, '</span>');

        _length = parseInt(config.duration);
        _min = Math.floor(_length / 60);
        _sec = Math.ceil(_length % 60);
        if (_sec < 10) {
          _sec = '0' + _sec;
        }
        _duration = '( ' + _min + ':' + _sec + ' )';

        var $newElement = $('<div />', {
          'class': 'button ' + command,
          'id': config.key,
          'html': config.trackNum + '. ' + config.artist + ' - ' + _name + '   ' + _duration
        });

      // +++++++++++++++++++++++++++++++++++ 
      } else {
      //
      // HERP DERP ON YOU!
      // +++++++++++++++++++++++++++++++++++

        $newElement = $('div', {html: '[ViewMaker] Command: ' + cmd + ' not recognized'});

      } // ENDIF

      $newElement.addClass(command);
      return $newElement;
    }
  };
})();

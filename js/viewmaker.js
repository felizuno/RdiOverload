(function() {
  window.ViewMaker = {
    make: function(cmd, config) {
      var $newElement;
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

        $newElement = $('<div />', {
          'class': 'button',
          'html': config.name,
        });

      // +++++++++++++++++++++++++++++++++++
      } else if (command == 'person') {
      //
      // CONFIG WITH AN RDIO USER
      // +++++++++++++++++++++++++++++++++++

        $newElement = $('<div />', {
          'id': config.key,
          'class': 'button',
          'html': config.username,
          'style':'background-image: url("' + config.icon + '")'
        });

      // +++++++++++++++++++++++++++++++++++
      } else if (command =='showcase') {
      //
      // CONFIG WITH AN RDIO PLAYLIST
      // +++++++++++++++++++++++++++++++++++

        var playlistName = config.name || 'No Title';
        $newElement = $('<div />', {
          'html': '<div class="showcase panel" style="display:none;">'
                    +'<div class="titlecontainer"><div class="close button">[ CLOSE ]</div><div class="albumtitle"></div></div>'
                    +'<div class="caseleft"><div class="caseart"></div></div>'
                    +'<div class="caseright"></div>'
                    +'<div class="casecommands"></div>'
                  +'</div>'
        });

      // +++++++++++++++++++++++++++++++++++
      } else if (command =='albumpanel') {
      //
      // CONFIG WITH AN RDIO PLAYLIST
      // +++++++++++++++++++++++++++++++++++

        var playlistName = config.name || 'No Title';
        $newElement = $('<div />', {
          'class': 'panel',
          'style': 'display: none',
          'html': '<div class="titlecontainer"><div class="listtitle">' + playlistName + '</div></div>'
                    +'<div class="albumgrid"></div>'
                  +'</div>'
        });

      // +++++++++++++++++++++++++++++++++++
      } else if (command =='artistpanel') {
      //
      // CONFIG WITH AN RDIO PLAYLIST
      // +++++++++++++++++++++++++++++++++++

        var playlistName = config.name || 'No Title';
        $newElement = $('<div />', {
          'class': 'panel',
          'style': 'display: none',
          'html': '<div class="titlecontainer"><div class="listtitle">' + playlistName + '</div></div>'
                    +'<div class="artistgrid"></div>'
                  +'</div>'
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
      } else if (command == 'artistthumb') {
      // 
      // CONFIG WITH AN RDIO ALBUM OBJECT
      // +++++++++++++++++++++++++++++++++++

        $newElement = $('<div />', {
          'class': 'button',
          'id': config.artist,
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

        $newElement = $('<div />', {
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

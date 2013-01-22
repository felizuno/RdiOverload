(function() {
  window.ViewMaker = {
    make: function(command, config) {

      if (command == 'plbutton' || command == 'peoplebutton') {
        var $newElement = $('<div />', {
          'class': 'button ' + command,
          'html': config.name,
          'style': 'display:none'
        });

      } else if (command =='viewbox') {
        var $newElement = $('<div />', {
          'class': command,
          'html': '<div class="showcase">'
                    +'<div class="albumitle"></div>'
                    +'<div class="caseleft">'
                      +'<div class="caseart"></div>'
                    +'</div>'
                    +'<div class="caseright"></div>'
                    +'<div class="casecommands"></div>'
                  +'</div>'
                  +'<div class="listtitle">' + config.data.name + '</div>'
                  +'<div class="albumgrid"></div>'
        });

      } else if (command == 'albumthumb') {
        $newElement = $('<div />', {
          'class': 'button ' + command,
          'id': config.albumKey,
          'style': 'background-image: url(' +config.icon + ')'
        });

      } else if (command == 'track') {
        var _name = config.name.replace('(', '<span>').replace(')', '</span>');

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
      }
      // ENDIF

      return $newElement;
    }
  };
})();

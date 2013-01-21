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
                    +'<div class="caseleft">'
                      +'<div class="caseart"></div>'
                      +'<div class="casecommands"></div>'
                    +'</div>'
                    +'<div class="caseright"></div>'
                  +'</div>'
                  +'<div class="viewTitle">' + config.data.name + '</div>'
                  +'<div class="albumgrid"></div>'
        });

      } else if (command = 'albumthumb') {
        $newElement = $('<div />', {
          'class': command,
          'id': config.albumKey,
          'style': 'background-image: url(' +config.icon + ')'
        });
      } 
      // ENDIF

      return $newElement;
    }
  };
})();

(function() {
  window.ViewMaker = {
    make: function(command, config) {
      if (command == 'plbutton' || command == 'peoplebutton') {
        var $newElement = $('<div />', {
          'class': command,
          'html': config.name,
          'style': 'display:none'
        });
      }

      if (command.indexOf('button') != -1) {
        $newElement.addClass('button');
      }

      return $newElement;
    }
  };
})();

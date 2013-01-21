(function() {
  window.ViewMaker = {
    makeButton: function(command, config) {
      var $newElement = $('<div />', {
        'class': 'button ' + command,
        'html': config.name,
        'style': 'display:none'
      });

      return $newElement;
    }
  };
})();

(function(){
  window.Chooser = {

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    init: function() {
      var self = this;
      
      $(".ribbontoggle").click(this.showHide);
      $('.placeholder').each(function(i, v) {
        $(v).bind('click', function() {
          Chooser.toggleChosen(this);
        });
      });
      $('.chooseraction').bind('click', function() {
        AV.changeList(Chooser.getCurrentChoice());
      });

      $('#ribbonchooser').slideDown('slow');
    },

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    addButtons: function(key, masterLists) {
      var lists = _.where(masterLists, {name: key});
      var target = '';

      if (key == 'UserPlaylists') {
        target = '#playlistmenu';

        _.each(lists, function(v, i) {
          ViewMaker.makeButton('plbutton', v.data)
            .bind('click', function() {
              Chooser.toggleChosen(this);
            }).appendTo(target);
        });
      } else if (key == 'Followers' || key == 'Following') {
        target = '#peoplemenu';

        ViewMaker.makeButton('peoplebutton', lists[0])
          .bind('click', function() {
            Chooser.toggleChosen(this);
          }).appendTo(target);
      } else if (key == 'TopCharts' || key == 'HeavyRotation') {
        target = '#playlistmenu';

        ViewMaker.makeButton('plbutton', lists[0])
          .bind('click', function() {
            Chooser.toggleChosen(this);
          }).appendTo(target);
      }
    },

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    getCurrentChoice: function() {
      var _listName = $('#playlistmenu .chosen').text();
      return _listName;
    },

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    showHide: function() {
      if (!($('.ribbontoggle').hasClass('shown'))) {
        $('#ribbonchooser').children().not('.ribbontoggle')
          .slideDown('fast');
      } else {
        $('#ribbonchooser').children().not('.ribbontoggle')
          .slideUp('fast');
      }

      $('.ribbontoggle').toggleClass('shown');
    },

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++    

    toggleChosen: function(button) {
      $parent = $(button).parent()
      $parent.find('.chosen').removeClass('chosen');
      $(button).toggleClass('chosen');
      this._toggleVisibility($parent);
    },

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    _toggleVisibility: function(buttonbar) {
      $(buttonbar).children().not('.chosen').slideToggle('fast');
    }
  };
})();
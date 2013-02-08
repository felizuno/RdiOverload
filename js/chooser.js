(function(){
  AV.Chooser = {

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    init: function() {
      var self = this;

      $(".ribbontoggle").click(this.showHide);
      $('.placeholder').each(function(i, v) {
        $(v).bind('click', function() {
          self.toggleChosen(this);
        });
      });
      $('.chooseraction').bind('click', function() {
        var cmd = ($(this).hasClass('albumgo') ? 'album' : 'artist');
        console.log(cmd);
        AV.changeList(cmd, self.getCurrentChoice());
        self.showHide()
      });
      $('#authbutton').unbind('click').bind('click', function() {
        $('#loginpanel').hide();
      });

      $('#ribbonchooser').slideDown('slow'); 
    },

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    getCurrentChoice: function() {
      var _listName = $('#playlistmenu .chosen').text();
      return _listName;
    },

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    addButtons: function(key, masterLists) {
      var lists = _.where(masterLists, {name: key});

      if (key == 'UserPlaylists') {
        _.each(lists, function(v, i) {
          ViewMaker.make('plbutton', v.data)
            .bind('click', function() {
              AV.Chooser.toggleChosen(this);
            }).appendTo('#playlistmenu');
        });
      } else if (key == 'TopCharts' || key == 'HeavyRotation') {
        ViewMaker.make('plbutton', lists[0])
          .bind('click', function() {
            AV.Chooser.toggleChosen(this);
          }).appendTo('#playlistmenu');
      }
    },
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++    
    
    removeOldPlaylists: function() {
      $('.plbutton').remove();
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
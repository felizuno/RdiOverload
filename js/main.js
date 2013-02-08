(function() {
  window.AV = {
    init: function() {
      var self = this;

      R.ready(function(){
        self.Rdio.authInit();
        self.bindCloseButtons();
        R.player.on('change:playingTrack', function(track) {
          self.Showcase.changePlayingTrack()
          var newTrack = track.attributes;
            $('#playertrack')
              .css('background-image', 'url(' + newTrack.icon +')')
              .html(newTrack.artist + '<br>' + newTrack.name);
        });
      });

      $('#header').find('.titlecontainer').bind('click', function() {
        self.toggleBetween('.viewbox', '#loginpanel', window.scrollTo(0, 0));
      });

      $('#help, #nowplaying').bind('click', function() {
        $(this).children().slideToggle();
      });
    },

    toggleBetween: function(a, b, coords) {
        // THIS LEAVES A LOT TO BE DESIRED, AND SHOULD BE BUILT OUT TO BE SMARTER
        $(a).toggle('scale');
        $(b).show();

        if (_.isArray(coords)) {window.scrollTo(coords[0], coords[1]);}
    },

    bindCloseButtons: function() {
      $('.close').unbind('click').bind('click', function() {
        AV.toggleBetween($(this).parent().parent(), '.viewbox');
      });
    },

    //
    //
    // MOVE THIS OVER TO THE RDIO OBJECT, BUT WHAT ABOUT THE
    // CHOOSER CALLS? FUCKS
    changeUser: function(userKey) {
      //this.Rdio._bumpToStorage(this.Rdio.masterLists);
      this.Chooser.removeOldPlaylists();
      this.Rdio.get('UserPlaylists', userKey, 100, AV.Chooser.addButtons);
      this.Rdio.get('HeavyRotation', userKey, 'albums', AV.Chooser.addButtons);
      this.Rdio.get('Following', userKey, 200, AV.UserPanel.addPeopleGroup);
      // this.Rdio.get('Followers', userKey, 200, AV.UserPanel.addPeopleGroup);
      $('#userpanel').hide();
    },

    changeList: function (command, newListName) {
      var newList = this.Rdio.pluckFromMasterLists(newListName);
      this._removeCurrentList();
      
      if (command == 'album') {
        AV.Showcase.newShowcase(newList, function() {
          $('.albumgrid').show();
        this.bindCloseButtons();
        });        
      } else if (command == 'artist') {
        // Make a panel with an artist grid
      }
    },

    showBio: function(artist) {
      var url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' 
        + artist 
        + '&api_key=d43e672a5af20763d43866fcbbf2d201&format=json&callback=?';
      
      $.getJSON(url, function(data) {
        var bio = data.artist.bio.content.replace(/<a/gi, '<a target="_blank"') 
          + '<div class="close button">[ CLOSE ]</div>';
        $('#biopanel').show().find('.panelbody').html(bio);
        AV.bindCloseButtons();
      });
    },

    _removeCurrentList: function() {
      $('.viewbox').remove();
    }
  };

  $(document).ready(function() {
    AV.init();
    AV.Router.init();
  });
})();

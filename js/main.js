(function() {
  window.AV = {
    init: function() {
      this._rdioSetup();

      R.ready(function(){AV.Rdio.getList('TopCharts', 'no key', 'Album', AV.Chooser.addButtons)});
      
      $('.close').each(function(i, v) {
        $(v).bind('click', function() {
          $(this).parent().parent().hide();
        });
      });

      $('#header').find('.titlecontainer').bind('click', function() {
        $('#loginpanel').show();
      });
    },

    changeList: function (newListName) {
      var newList = this.Rdio.pluckFromMasterLists(newListName);      
      this._removeCurrentList();
      ViewMaker.make('viewbox', newList).appendTo('#maincontent');
      AV.Showcase.newShowcase(newList);
    },

    showBio: function(artist) {
      var url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' 
        + artist 
        + '&api_key=d43e672a5af20763d43866fcbbf2d201&format=json&callback=?';
      
      $.getJSON(url, function(data) {
        self.loading = false;

        $('#biopanel').show()
          .find('.panelbody').html(data.artist.bio.content.replace('<a', '<a target="_blank"'))
          .find('.artistArt').attr('src', data.artist.image[3]['#text']);
      });
    },

    _rdioSetup: function() {
      var self = this;
      R.ready(function(){
        if (R.authenticated()) {
          $('#authbutton').html('Dive in').show()
            .bind('click', function() {
              self.Chooser.init();
              $('#loginpanel').hide();
          });

          $('.peoplebutton').text(R.currentUser.get('vanityName'));

          var userKey = R.currentUser.get('key');
          self.Rdio.getList('UserPlaylists', userKey, 100, AV.Chooser.addButtons);
          self.Rdio.getList('HeavyRotation', userKey, 'albums', AV.Chooser.addButtons);
          //self.Rdio.getList('Following', userKey, 500, AV.Chooser.addButtons);
          //self.Rdio.getList('Followers', userKey, 500, AV.Chooser.addButtons);
        } else {
          // Add the #authbutton only if they need it, since login will always show at first
          $('#authbutton').html('Click to authenticate with Rdio').show()
            .bind('click', function() {
              R.authenticate(self._rdioSetup);
          });
        }
      });
    },

    _removeCurrentList: function() {
      $('.viewbox').remove();
    }
  };

  $(document).ready(function() {
    AV.init();
  });
})();

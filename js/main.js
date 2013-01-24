(function() {
  window.AV = {
    init: function() {
      var self = this;

      this.Rdio.authInit();
      this.bindCloseButtons();

      R.ready(function(){
        self.Rdio.get('TopCharts', 'no key', 'Album', self.Chooser.addButtons)
        R.player.on('change:playingTrack', function(track) {
          self.Showcase.changePlayingTrack()
          var newTrack = track.attributes;
            $('#playertrack')
              .css('background-image', 'url(' + newTrack.icon +')')
              .html(newTrack.artist + '<br>' + newTrack.name);
        });
      });

      $('#header').find('.titlecontainer').bind('click', function() {
        self.flipTo('.viewbox', '#loginpanel', window.scrollTo(0, 0));
      });

      $('#help, #nowplaying').bind('click', function() {
        $(this).children().slideToggle();
      });
    },

    flipTo: function(a, b, coords) {
        // THIS LEAVES A LOT TO BE DESIRED, AND SHOULD BE BUILT OUT TO BE SMARTER
        $(a).hide();
        $(b).show();

        if (_.isArray(coords)) {window.scrollTo(coords[0], coords[1]);}
    },

    bindCloseButtons: function() {
      $('.close').unbind('click').bind('click', function() {
        AV.flipTo($(this).parent().parent(), '.viewbox');
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
  });
})();

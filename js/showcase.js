(function() {
  AV.Showcase = {

    newShowcase: function(masterListObject, callback) {
      var self = this;
      var data = masterListObject.data;

      ViewMaker.make('albumpanel', data).appendTo('#maincontent');
      ViewMaker.make('artistpanel', data).appendTo('#maincontent');
      ViewMaker.make('showcase', data).appendTo('#maincontent');

      _.each(masterListObject.data.albums, function(v, i) {
        var bio;
        var iconUrl;
        var url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' 
          + v.artist
          + '&api_key=d43e672a5af20763d43866fcbbf2d201&format=json&callback=?';

        ViewMaker.make('albumthumb', v).bind('click', function() {
          $('.showcase').slideDown('1000');
          $(this)
            .effect(
              'transfer', { to: $('.caseart') }, 250,
              //callback for effect
              self.changeFeatured(this, masterListObject)
            )
         // window.scrollTo(0, 0);
        }).appendTo('.albumgrid');

        $.getJSON(url, function(data) {
          iconUrl = data.artist.image[3]['#text'];
          //console.log(iconUrl);
          bio = data.artist.bio.content.replace(/<a/gi, '<a target="_blank"');
     
          var config = {
            'artist': v.artist,
            'icon': iconUrl,
            'bio': bio
          };

          ViewMaker.make('artistthumb', config).bind('click', function() { // NEED TO ADD TO VIEWMAKER
            $('.showcase').slideDown('1000');
            $(this)
              .effect(
                'transfer', { to: $('.caseart') }, 250,
                //callback for effect
                self.changeFeatured(this, masterListObject)
              );
           // window.scrollTo(0, 0);
          }).appendTo('.artistgrid');
        });
      });

      if (_.isFunction(callback)) { callback(); }
    },

    changeFeatured: function(thumb, masterListObject) {
      var self = this;
      var trigger = $(thumb);

      if (trigger.hasClass("albumthumb")) {
        var rdioKey = trigger.attr('id');
        var _albumData = _.find(masterListObject.data.albums, function(album) { return album.albumKey == rdioKey || album.key == rdioKey; });
        var _artist = _albumData.artist;

        // $('.albumgrid').slideDown('1000').hide();
        $('.caseright').children().add('.rdioaction').remove();
        
        self._addAlbumActions(_artist, rdioKey);
        $('.albumtitle').text(_artist + ' - ' + (_albumData.album || _albumData.name));
        $('.caseart').css('background-image', 'url(' + _albumData.icon.replace('-200.jpg', '-600.jpg'));
        //can this move?
        AV.Rdio.get('TracksForAlbum', rdioKey, 'tracks', self._addTrackList);
      } else if (trigger.hasClass("artistthumb")) {
        // make the artist panel
      }
    },

    changePlayingTrack: function() {
      $('.playing').removeClass('playing');
      var np = R.player.playingTrack().get('key');
      
      $('.track').each(function(i, v) {
        var $v = $(v);
        if (np == $v.attr('id')) {
          $v.addClass('playing');
        }
      });
    },

    _addAlbumActions: function(artist, albumKey) {
      ViewMaker.make('rdioaction', {'name':'Artist Info'}).bind('click', function() {
        AV.showBio(artist);
      }).appendTo('.casecommands');

      ViewMaker.make('rdioaction', {'name':'Play Album'}).bind('click', function() {
        R.player.queue.addPlayingSource();
        R.player.play({source: albumKey});
      }).appendTo('.casecommands');
      
      ViewMaker.make('rdioaction', {'name':'Queue Album'}).bind('click', function() {
        R.player.queue.add(albumKey);
      }).appendTo('.casecommands');

    },

    _addTrackList: function(call, album) {
      var sc = AV.Showcase;
      _.each(album.tracks, function(v, i) {
          ViewMaker.make('track', v).bind('click', function() {
            R.player.play({source: $(this).attr('id')});
          }).appendTo('.caseright');
      });
      sc.changePlayingTrack();
    }
  };
})();
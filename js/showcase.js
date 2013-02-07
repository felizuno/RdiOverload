(function() {
  AV.Showcase = {

    newShowcase: function(masterListObject) {
      var self = this;

      _.each(masterListObject.data.albums, function(v, i) {
        ViewMaker.make('albumthumb', v).bind('click', function() {
          //$('.ui-effects-transfer').css('background-color: #fff');//'background-image: url("' + $(albumThumb).attr('href') + '")');
          $('.showcase').slideDown('1000');
          $(this)
            .effect(
              'transfer', { to: $('.caseart') }, 250,
              //callback for effect
              self.changeFeaturedAlbum(this, masterListObject)
            );
          window.scrollTo(0, 0);
        }).appendTo('.albumgrid');
      });
    },

    changeFeaturedAlbum: function(albumThumb, masterListObject) {
      var self = this;


      var rdioKey = $(albumThumb).attr('id');
      var _albumData = _.find(masterListObject.data.albums, function(album) { return album.albumKey == rdioKey || album.key == rdioKey; });
      var _artist = _albumData.artist;

      // $('.albumgrid').slideDown('1000').hide();
      $('.caseright').children().add('.rdioaction').remove();
      
      self._addAlbumActions(_artist, rdioKey);
      $('.albumtitle').text(_artist + ' - ' + (_albumData.album || _albumData.name));
      $('.caseart').css('background-image', 'url(' + _albumData.icon.replace('-200.jpg', '-600.jpg'));
      //can this move?
      AV.Rdio.get('TracksForAlbum', rdioKey, 'tracks', self._addTrackList);
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
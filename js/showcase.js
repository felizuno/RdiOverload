(function() {
  AV.Showcase = {
    albumRdioData: {},

    newShowcase: function(masterListObject) {
      var self = this;
      albumRdioData = {};

      _.each(masterListObject.data.albums, function(v, i) {
        ViewMaker.make('albumthumb', v).bind('click', function() {
          AV.Showcase.changeFeaturedAlbum(this, masterListObject);
          window.scrollTo(0, 0);
        }).appendTo('.albumgrid');
      });
    },

    changeFeaturedAlbum: function(albumThumb, masterListObject) {
      $('.caseright').children().add('.rdioaction').remove();
      
      var self = this;
      var rdioKey = $(albumThumb).attr('id');
      var _albumData = _.find(masterListObject.data.albums, function(album) { return album.albumKey == rdioKey; });
      
      $('.caseart').css('background-image', 'url(' + _albumData.icon.replace('-200.jpg', '-600.jpg'));
      self._addRdioActions(rdioKey);
  
      ViewMaker.make('rdioaction', {'name':'Artist Info'}).bind('click', function() {
          AV.showBio(_albumData.artist);
        }).show().appendTo('.casecommands');

      $('.albumtitle').text(_albumData.artist + ' - ' + _albumData.album);
      //can this move?
      AV.Rdio.get('TracksForAlbum', rdioKey, 'tracks', self._addTrackList);
    },

    changePlayingTrack: function() {
      $('.playing').removeClass('playing');
      // ASK IAN ABOUT THIS ++++++++++++++++++
      var npt = R.player.playingTrack();    //
      var np = npt.attributes.key;       //
      //+++++++++++++++++++++CAN I USE A GET?+
      $('.track').each(function(i, v) {
        $v = $(v);
        if (np == $v.attr('id')) {
          $v.addClass('playing');
        }
      });

    },

    _addRdioActions: function(albumKey) {
      ViewMaker.make('rdioaction', {'name':'Play Album'}).bind('click', function() {
        R.player.queue.addPlayingSource();
        R.player.play({source: albumKey});
      }).show().appendTo('.casecommands');
      
      ViewMaker.make('rdioaction', {'name':'Queue Album'}).bind('click', function() {
        R.player.queue.add(albumKey);
      }).show().appendTo('.casecommands');
    },

    _addTrackList: function(call, album) {
      var sc = AV.Showcase;
      sc.albumRdioData = album; // refer to this later for other data needs?
      _.each(album.tracks, function(v, i) {
          ViewMaker.make('track', v).bind('click', function() {
            R.player.play({source: $(this).attr('id')});
          }).appendTo('.caseright');
      });
      sc.changePlayingTrack();
    }
  };
})();
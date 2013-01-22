(function() {
  AV.Showcase = {
    albumRdioData: {},

    newShowcase: function(masterListObject) {
      var self = this;
      albumRdioData = {};

      _.each(masterListObject.data.albums, function(v, i) {
        ViewMaker.make('albumthumb', v).bind('click', function() {
          AV.Showcase.changeFeaturedAlbum(this, masterListObject);
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
      $('.albumtitle').text(_albumData.artist + ' - ' + _albumData.album);
      AV.Rdio.getList('TracksForAlbum', rdioKey, 'tracks', self._addTrackList);
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
      this.albumRdioData = album; // refer to this later for other data needs?
      _.each(album.tracks, function(v, i) {
          ViewMaker.make('track', v).appendTo('.caseright');
      });
    }
  };
})();
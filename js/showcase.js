(function() {
  AV.showcase = {
    albumRdioData: {},
    rdioActions: ['Play Album', 'Queue Album'],
    optionalActions: ['Remove from Playlist'],

    newShowcase: function(newList) {
      var self = this;
      albumRdioData = {};

      _.each(newList.data.albums, function(v, i) {
        ViewMaker.make('albumthumb', v).bind('click', function() {
          AV.showcase.setUpShowcase(this, newList);
        }).appendTo('.albumgrid');
      });
    },

    setUpShowcase: function(albumThumb, list) {
      var self = this;
      $('.caseright').children().remove();
      var newAlbumKey = $(albumThumb).attr('id');
      var _albumData = _.find(list.data.albums, function(album) { return album.albumKey == newAlbumKey; });
      
      //self._addRdioActions(self.rdioActions, newAlbumKey);

      $('.caseart').css('background-image', 'url(' + _albumData.icon.replace('-200.jpg', '-400.jpg'));
     
      AV.Rdio.getList('TracksForAlbum', newAlbumKey, 'tracks', self._addTrackList);
    },

    _addRdioActions: function(options, albumKey) {

    },

    _addTrackList: function(call, album) {
      this.albumRdioData = album;
      _.each(album.tracks, function(v, i) {
          ViewMaker.make('track', v).appendTo('.caseright');
      });
    }
  };
})();
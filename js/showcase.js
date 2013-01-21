(function() {
  AV.showcase = {
    albumRdioData: {},

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
      var _key = $(albumThumb).attr('id');
      var _album = _.find(list.data.albums, function(album) { return album.albumKey == _key; });

      AV.Rdio.getList('TracksForAlbum', _album.albumKey, 'tracks', self._addTrackList);
      $('.caseart').css('background-image', 'url(' + _album.icon.replace('-200.jpg', '-400.jpg'));

    },

    _addTrackList: function(call, album) {
      this.albumRdioData = album;
      _.each(album.tracks, function(v, i) {
          ViewMaker.make('track', v).show().appendTo('.caseright');
        })
      });
    }
  };
})();
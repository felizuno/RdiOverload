(function() {
  AV.showcase = {
    newShowcase: function(newList) {
      var self = this;
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
      var callback = function(call, data) {
        console.log(data);
        //ViewMaker.make('track', data).show().appendTo('.caseright');
      };
      debugger;
      _.each(album.trackKeys, function(v, i) {
        AV.Rdio.getList('TracksForAlbum', v.key, 'track', this.callback)
      });
    }
  };
})();
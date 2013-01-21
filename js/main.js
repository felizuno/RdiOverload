(function() {
  window.AV = {
    init: function() {
      this._rdioSetup();
      R.ready(function(){AV.Rdio.getList('TopCharts', 'no key', 'Album', Chooser.addButtons)});
    },

    changeList: function (newListName) {
      var newList = this.Rdio.pluckFromMasterLists(newListName);
      
      this._removeCurrentList();
      ViewMaker.make('viewbox', newList).appendTo('#maincontent');

      _.each(newList.data.albums, function(v, i) {
        ViewMaker.make('albumthumb', v).bind('click', function() {
          AV.showcase(this, newList);
        }).appendTo('.albumgrid');
      });
    },

    showcase: function(albumThumb, list) {
      var _key = $(albumThumb).attr('id');
      var _album = _.find(list.data.albums, function(album) { return album.albumKey == _key; });
      $('.caseart').css('background-image', 'url(' + _album.icon.replace('-200.jpg', '-400.jpg'));
    },

    _rdioSetup: function() {
      var self = this;
      R.ready(function(){
        if (R.authenticated()) {
          $('.peoplebutton').text(R.currentUser.get('vanityName'));

          var userKey = R.currentUser.get('key');
          self.Rdio.getList('UserPlaylists', userKey, 100, Chooser.addButtons);
          self.Rdio.getList('HeavyRotation', userKey, 'albums', Chooser.addButtons);
          //self.Rdio.getList('Following', userKey, 500, Chooser.addButtons);
          //self.Rdio.getList('Followers', userKey, 500, Chooser.addButtons);

          $('.login').remove();
        } else {
          // Add the #authbutton only if they need it, since login will always show at first
          $('.login').find('#authbutton').html('Click to authenticate with Rdio').show()
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
    Chooser.init();
  });
})();



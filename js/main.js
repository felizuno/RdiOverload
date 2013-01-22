(function() {
  window.AV = {
    init: function() {
      this._rdioSetup();
      R.ready(function(){AV.Rdio.getList('TopCharts', 'no key', 'Album', AV.Chooser.addButtons)});
    },

    changeList: function (newListName) {
      var newList = this.Rdio.pluckFromMasterLists(newListName);      
      this._removeCurrentList();
      ViewMaker.make('viewbox', newList).appendTo('#maincontent');
      AV.Showcase.newShowcase(newList);
    },

    _rdioSetup: function() {
      var self = this;
      R.ready(function(){
        if (R.authenticated()) {
          $('.peoplebutton').text(R.currentUser.get('vanityName'));

          var userKey = R.currentUser.get('key');
          self.Rdio.getList('UserPlaylists', userKey, 100, AV.Chooser.addButtons);
          self.Rdio.getList('HeavyRotation', userKey, 'albums', AV.Chooser.addButtons);
          //self.Rdio.getList('Following', userKey, 500, AV.Chooser.addButtons);
          //self.Rdio.getList('Followers', userKey, 500, AV.Chooser.addButtons);

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
    AV.Chooser.init();
  });
})();



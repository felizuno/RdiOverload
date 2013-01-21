(function() {
  window.AV = {
    init: function() {
      this._rdioSetup();
      R.ready(function(){AV.Rdio.getList('TopCharts', '', 'Album', Chooser.addButtons)});
    },

    _rdioSetup: function() {
      var self = this;
      R.ready(function(){
        if (R.authenticated()) {
          // +++++
          // .login is a fixed panel that will appear at least until Rdio is ready.
          // If the user is not authenticated it will show the #authbutton.
          // If they are already authd it will kick off the playlist loading
          // +++++
          $('.peoplebutton').text(R.currentUser.get('vanityName'));

          var userKey = R.currentUser.get('key');
          self.Rdio.getList('UserPlaylists', userKey, 100, Chooser.addButtons);
          self.Rdio.getList('Following', userKey, 500, Chooser.addButtons);
          self.Rdio.getList('Followers', userKey, 500, Chooser.addButtons);
          self.Rdio.getList('HeavyRotation', userKey, 'albums', Chooser.addButtons);

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
  };

  $(document).ready(function() {
    AV.init();
    Chooser.init();
  });
})();



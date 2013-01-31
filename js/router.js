(function() {
  AV.Router = {
    init: function() {
      Path.map("#/:user_key(/:playlist_key)").to(function(){
          AV.Router._routeFromURL((this.params["user_key"] || R.currentUser.get('key')), this.params["playlist_key"]);
      });

      Path.rescue(function(){
          alert("404: Route Not Found");
      });

      //Path.listen();
    },

    _routeFromURL: function(userKey, listKey) {
      // initiate the correct view based on the inbound URL
    }
  };
})();
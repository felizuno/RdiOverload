(function() {
  AV.UserPanel = {

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // The UserPanel should have 3 main divs:
    //   1. A div for the follower/following lists we'll be loading
    //   2. A div that displays the users in a given lists
    //   3. A div of actions ('Browse Followers', 'Browse Following',
    //     'Browse Playlists')
    // It Needs to know how to:
    //   Ask for a users playlists
    //   Ask for a users followers/following
    //   
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    addPeopleGroup: function(key, masterLists) {
      // lists is an array with a: 
      //  name ('Followers' or 'Following'),
      //  data (an array of objects, each of which has a 'key' property)
      //  owner (the Rdio key of the user whose peopleGroup this is)
      var lists = _.where(masterLists, {name: key});

      // WHY AM I USING lists[0]
      ViewMaker.make('peoplebutton', lists[0]).bind('click', function() {
        AV.Chooser.toggleChosen(this);
      }).appendTo('#peoplemenu');
    }

  };
})();
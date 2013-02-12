(function() {
  AV.UserPanel = {
    groups: [],

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // The UserPanel should have 4 main divs:
    //   1. A div for R.currentUser to anchored to the user's account
    //   2. A div for the follower/following lists we'll be loading
    //   3. A div that displays the users in a given list
    //   4. A div of actions ('Browse Followers', 'Browse Following',
    //     'Browse Playlists')
    // It Needs to know how to:
    //   Ask for a users playlists/followers/following
    //   
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    addPeopleGroup: function(key, masterLists) {
      var self = AV.UserPanel;

      var people = _.where(masterLists, {name: key})[0];
      //  people is an array with a(n): 
      //    name ('Followers' or 'Following'),
      //    data (an array of objects, each of which has a 'key' property)
      //    owner (the Rdio key of the user whose peopleGroup this is)
      self.groups.push(people);
      AV. Chooser.addButtons('following', masterLists);
      self.showPeopleGroup(people);
      // ViewMaker.make('peoplebutton', lists[0]).bind('click', function() {
      //   AV.Chooser.toggleChosen(this);
      // }).appendTo('#peoplemenu');
    },

    showPeopleGroup: function(group) {
      console.log(group);
      _.each(group.data, function(v, i) {
        ViewMaker.make('person', v).appendTo('#userpanel .people');
      });
    }
  };
})();
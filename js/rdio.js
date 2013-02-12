(function() {
  AV.Rdio = {
    masterLists: [], // ONLY WRITE FROM get, ONLY GET VIA pluckFromMasterlists

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    authInit: function() {
      var self = this;
      R.ready(function(){
        if (R.authenticated()) {
          $('#authbutton').html('Dive in').unbind('click')
            .bind('click', function() {
              AV.changeUser(R.currentUser.get('key'));
              AV.Chooser.init();
              // CHANGE THE PANEL CONTENT SO THE USER KNOWS SOEMTHING
              // HAPPENED. GIVE INSTRUCTIONS FOR HOW TO USE THE CHOOSER
              // ALSO GOING TO HAVE TO RENAME THE PANEL  NOW THAT It
              // HAS THIS OTHER USE
              $('#loginpanel').hide();
          });
          $('.peoplebutton').text(R.currentUser.get('vanityName'));

        } else {
          self.get('TopCharts', '', 'Album', AV.Chooser.addButtons)
          AV.Chooser.init();
          $('#authbutton').html('Click to authenticate with Rdio')
            .bind('click', function() {
              R.authenticate(self.authInit);
          });
        }
      });
    },

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 //Should this move inside the master list object as a method?
 
    pluckFromMasterLists: function(name) {
      var list = _.find(this.masterLists, function(v) {return v.data.name == name;});
      return list;
    },

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    get: function(call, key, responseParam, callback) {
      var self = this;
      var _method = self._addPrefix(call);
      var _resultObjectType = self._predictResponseType(call);

    // ---------------------
      if (call == "UserPlaylists" || call == "Following" || call == 'Followers') {
    // ---------------------
        R.ready(function() {
          R.request({
            method: _method,
            content:{
              user: key,
              count: responseParam,
              extras: '-*,name,key,trackKeys,ownerKey,vanityName,icon'
            },
            success: function(data) {
              self._pushToMasterLists(data.result, call, key, _resultObjectType);
              if (_.isFunction(callback)) { callback(call, self.masterLists); }
            }
          });
        });
    // ---------------------
      } else if (call == 'TopCharts' || call == "HeavyRotation" ) {
    // --------------------- 
        R.ready(function() {
          R.request({
            method: _method,
            content: {
              type: responseParam,
              count: 100,
              extras: '-*,key,album,icon,artistKey,artist,name'
            },
            success: function(data) {
              var mockList = { 'key': call, 'name': call, 'albums': [] };

              _.each(data.result, function(v, i) {
                mockList.albums.push(v);
              });
              self._pushToMasterLists([mockList], call, key, _resultObjectType);

              if (_.isFunction(callback)) { callback(call, self.masterLists); }
            }
          });
        });
    // ---------------------
      } else if (call == 'TracksForAlbum') {
    // ---------------------
        R.request({
          method: 'get',
          content: {
            keys: key,
            extras: 'tracks'
          },
          success: function(data) {
            if (_.isFunction(callback)) { callback(call, data.result[key]); }
          }
        });
      } else {
        // this is for when the call is not recognized
        console.log('You can\'t Rdio.get ' + call + '. Key is: ' + key);
      }
    },
    
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    
    player: function(call, key, callback) {
      
      if (call == 'play') {
        // ----------
        var _k = key[0];
        if (_k == 'a' || _k == 'ca') { R.player.queue.addPlayingSource(); }
        R.player.play({source: key});
        
        // ----------
      } else if (call == 'playpause') {
        // ----------
        R.player.togglePause();
        
        // ----------
      } else if (call == 'queue') {
        // ----------
        R.player.queue.add(key);
        
        // ----------
      } else if (call == 'queueNext') {
        if (key == '') {
          // IF THERE WAS NO KEY THEN PLAY THE NEXT THING IN THE QUEUE
        } else {
          // IF KEY IS A REAL KEY (FORMAT CHECK) THEN 
        }
      }
    },

// --------------------------------
// 
//              LOCALS ONLY!
// 
// --------------------------------
    _pushToMasterLists: function(array, call, key, listType) {
      var self = this;
      var __mL = self.masterLists;

      var __push = function(data) {
        var ownerKey = data.owner || key;
        __mL.push({ 'name': call, 'owner': ownerKey, 'data': data });
      };

      if (listType == 'music') {
        _.each(array, function(v, i) {
          if (!!v.trackKeys) {
            self._convertTracksToAlbums(v, v.name);
          }
          __push(v);
        });
      } else if (listType == 'people') {
        __push(array);
      }
    },
// --------------------------------
    _addPrefix: function(call) {
      var _method = '';
      if (call == 'Following' || call == 'Followers') {
        _method = 'user' + call;
      } else {
        _method = 'get' + call;
      }

      return _method
    },
// --------------------------------
    _predictResponseType: function(call) {
      var _type;
      if (call == 'Following' || call == 'Followers') { _type = 'people'; } 
      else { _type = 'music' }

      return _type;
    },
// --------------------------------
    _convertTracksToAlbums: function(data, listName) {
      var self = this;
      var albums = [];
      
      if (data.trackKeys) {
        var _keyChain = _.uniq(data.trackKeys, true).join();

        R.request({
          method: 'get',
          content: {
            keys: _keyChain,
            extras: '-*,albumKey,album,icon,artistKey,artist,name'
          },
          success: function(response) {
             var list = self.pluckFromMasterLists(data.name);
             var _deDupedAlbums = [];
             var _tempKeys = [];

             _.each(response.result, function(v, k) {
               if (!_.contains(_tempKeys, v.albumKey)) {
                  _tempKeys.push(v.albumKey)
                  _deDupedAlbums.push(v);
               }
             });

             list.data.albums = _deDupedAlbums;
          } //END Success
        });
      }
    }
  };
})();
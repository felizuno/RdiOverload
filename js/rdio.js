(function() {
  AV.Rdio = {
    masterLists: [], // ONLY WRITE FROM getList, ONLY GET VIA pluckFromMasterlists

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    pluckFromMasterLists: function(name) {
      var list = _.find(this.masterLists, function(v) {
        return v.data.name == name;
      });
      return list;
    },
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    get: function(call, key, responseParam, callback) {
      var self = this;
      var _method = self._triageCallType(call);
      var _type = self._triageResponseType(call);

      // ----------------------------------------------------
      if (call == "UserPlaylists" || call == "Following" || call == 'Followers') {
      // ----------------------------------------------------
        R.ready(function() {
          R.request({
            method: _method,
            content:{
              user: key,
              count: responseParam,
              extras: '-*,name,key,trackKeys'
            },
            success: function(data) {
              self._pushToMasterLists(data.result, call, _type);
              if (_.isFunction(callback)) {
                callback(call, self.masterLists);
              }
            }
          });
        });
      // ----------------------------------------------------
      } else if (call == 'TopCharts' || call == "HeavyRotation" ) {
      // ----------------------------------------------------
        R.ready(function() {
          R.request({
            method: _method,
            content: {
              type: responseParam,
              count: 100,
              extras: '-*,albumKey,album,icon,artistKey,artist,name'
            },
            success: function(data) {
              var mockList = { 'key': call, 'name': call, 'albums': [] };

              _.each(data.result, function(v, i) {
                mockList.albums.push(v);
              });
              self._pushToMasterLists([mockList], call, _type);

              if (_.isFunction(callback)) {
                callback(call, self.masterLists);
              }
            }
          });
        });
      // ----------------------------------------------------
      } else if (call == 'TracksForAlbum') {
      // ----------------------------------------------------
        R.request({
          method: 'get',
          content: {
            keys: key,
            extras: 'tracks'
          },
          success: function(data) {
            if (_.isFunction(callback)) {
              callback(call, data.result[key]);
            }
          }
        });
      }
    },
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
player: function(call, key, callback) {
  
  if (call == 'play') {
    // ----------
    var _k = key[0];
    if (_k == 'a' || _k == 'ca') {R.player.queue.addPlayingSource();}
    R.player.play({source: key});
    // ----------
  } else if (call == 'queue') {
    // ----------
    R.player.queue.add(key);
    // ----------
  } else if (call == 'queueNext') {
    if (!key.length > 1) {
      
    } else {
      
    }
  }
},

// ---------------------------------------------------------------
// 
//              LOCALS ONLY!
// 
// ---------------------------------------------------------------
    _pushToMasterLists: function(array, call, _type) {
      var self = this;

      var __mL = self.masterLists;
      var __push = function(data) {
        __mL.push({
          'name': call,
          'data': data
        });
      };

      if (_type == 'list') {
        _.each(array, function(v, i) {
          if (!!v.trackKeys) {
            self._convertTracksToAlbums(v, v.name);
          }
          __push(v);
        });
      } else if (_type == 'people') {
        __push(array);
      }
    },
// ---------------------------------------------------------------
    _resetMasterLists: function () {
      this.masterLists = [];
    },
// ---------------------------------------------------------------
    _triageCallType: function(call) {
      var _method;
      if (call == 'Following' || call == 'Followers') {
        _method = 'user' + call;
      } else {
        _method = 'get' + call;
      }

      return _method
    },
// ---------------------------------------------------------------
    _triageResponseType: function(call) {
      var _type;
      if (call == 'Following' || call == 'Followers') {
        _type = 'people';
      } else {
        _type = 'list'
      }

      return _type;
    },
// ---------------------------------------------------------------
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
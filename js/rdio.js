(function() {
  AV.Rdio = {
    masterLists: [], // ONLY WRITTEN TO BY getList

    getList: function(call, key, responseParam, callback) {
      var self = this;
      var _method = self._triageCallType(call);
      var _type = self._triageResponseType(call);
      // Local pushing function

      // Begin Rdio calls
      if (call == "UserPlaylists" || call == "Following" || call == 'Followers') {
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
      } else if (call == 'TopCharts' || call == "HeavyRotation" ) {
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
      }
    },

    // -----
    playback: function() {

    },

    modify: function () {

    },

    pluckFromMasterLists: function(name) {
      var list = _.find(this.masterLists, function(v) {
        return v.data.name == name;
      });
      return list;
    },

    _triageCallType: function(call) {
      var _method;
      if (call == 'Following' || call == 'Followers') {
        _method = 'user' + call;
      } else {
        _method = 'get' + call;
      }

      return _method
    },

    _triageResponseType: function(call) {
      var _type;
      if (call == 'Following' || call == 'Followers') {
        _type = 'people';
      } else {
        _type = 'list'
      }

      return _type;
    },

    _resetMasterLists: function () {
      this.masterLists = [];
    },

    _convertTracksToAlbums: function(data, listName) {
      var self = this;
      var albums = [];
      
      if (data.trackKeys) {
        var _keyChain = data.trackKeys.join();

        R.request({
          method: 'get',
          content: {
            keys: _keyChain,
            extras: '-*,albumKey,album,icon,artistKey,artist,name'
          },
          success: function(response) {
             var list = self.pluckFromMasterLists(data.name);
             console.log(list);
             list.data.albums = response.result;
          } //END Success
        });
      }
    },

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
    }
  };
})();
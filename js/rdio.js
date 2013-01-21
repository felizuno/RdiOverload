(function() {
  AV.Rdio = {
    masterLists: [], // ONLY WRITTEN TO BY getList

    getList: function(call, key, responseParam, callback) {
      var self = this;
      var _method = self._triageCallType(call);
      var _type = self._triageResponseType(call);
      var _pushToMasterLists = function(array) {
        var __mL = self.masterLists;
        var __push = function(data) {
          __mL.push({
            'name': call,
            'type': _type,
            'data': data
          });
        };

        if (_type == 'albums') {
          _.each(array, function(v, i) {
            __push(v);
          });
        } else if (_type == 'people') {
          __push(array);
        }
      };


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
              _pushToMasterLists(data.result);
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
              extras: '-*,name,key,trackKeys,artistKey'
            },
            success: function(data) {
              var fakePlaylist = { 'key': call, 'name': call, 'albums': [] };

              _.each(data.result, function(v, i) {
                fakePlaylist.albums.push(v);
              });
              _pushToMasterLists([fakePlaylist]);

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

    _resetMasterLists: function () {
      this.masterLists = [];
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
        _type = 'albums'
      }

      return _type;
    }
  };
})();
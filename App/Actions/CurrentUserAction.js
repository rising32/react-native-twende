'use strict';

var React = require('react-native');
var {
  AsyncStorage
} = React;
var LocalKeyStore  = require('../Stores/LocalKeyStore');
var TokenStore  = require('../Stores/TokenStore');
var CurrentUserStore = require('../Stores/CurrentUserStore');
var CurrentUserService = require('../Services/CurrentUserService');

var CurrentUserActions = {
    reloadUser: function () {
        AsyncStorage.getItem('token').then((token) => {
            CurrentUserService.getProfile(token);
        });
    },
    logout: function() {
        CurrentUserStore.clear();

    }
};

module.exports = CurrentUserActions;

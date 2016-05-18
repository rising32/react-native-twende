'use strict';

var React = require('react-native');
var {
  AsyncStorage
} = React;
var LocalKeyStore  = require('../Stores/LocalKeyStore');
var TokenStore  = require('../Stores/TokenStore');


var CurrentUserStore = {
    _listeners: [],
    _currentUser: {},
    get: function(callback) {
        return this._currentUser;
    },
    set: function(currentUser){
        this._currentUser = currentUser;
        this.notifyListeners(currentUser);
        return {};
    },
    setLoginError: function(error) {
        this._currentUser = {};
        this.notifyListeners(false);
    },
    clear: function(error) {
        this._currentUser = {};
        this.notifyListeners(false);
    },

    notifyListeners: function(currentUser){
        for (var t = 0; t < this._listeners.length; t++) {
            this._listeners[t](currentUser);
        }
    },
    addListener: function(listener) {
        this._listeners.push(listener);
    },
    clearListeners: function(){
        this._listeners = [];
    }
};

module.exports = CurrentUserStore;
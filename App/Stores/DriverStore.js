'use strict';

var React = require('react-native');
var {
  AsyncStorage
} = React;
var LocalKeyStore  = require('../Stores/LocalKeyStore');


var DriverStore = {
    _drivers: {},
    _listeners: [],
    getList: function(callback) {
        return this._drivers;
        // return LocalKeyStore.getKey('currentUser', callback);
    },
    setList: function(drivers){
        this._drivers = drivers;
        this.notifyListeners(drivers);
        return {};
        //return LocalKeyStore.setKey('currentUser', currentUser);
    },
    notifyListeners: function(drivers){
        for (var t = 0; t < this._listeners.length; t++) {
            this._listeners[t](drivers);
        }
    },
    addListener: function(listener) {
        return this._listeners.push(listener);
    },
    clearListeners: function() {
        this._listeners = []
    },
    removeListener: function(listenerId) {
        this._listeners.splice(listenerId, 1);
    }
};

module.exports = DriverStore;
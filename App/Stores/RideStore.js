'use strict';

var React = require('react-native');
var {
  AsyncStorage
} = React;
var LocalKeyStore  = require('../Stores/LocalKeyStore');


var RideStore = {
    _currentRide: {},
    _listeners: [],
    getCurrent: function(callback) {
        return this._currentRide;
    },
    setCurrent: function(ride){
        this._currentRide = ride;
        this.notifyListeners(ride);
        return {};
    },
    notifyListeners: function(ride){
        for (var t = 0; t < this._listeners.length; t++) {
            this._listeners[t](ride);
        }
    },
    addListener: function(listener) {
        this._listeners.push(listener);
    }
};

module.exports = RideStore;
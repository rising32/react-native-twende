'use strict';

var React = require('react-native');
var {
  AsyncStorage
} = React;
var LocalKeyStore  = require('../Stores/LocalKeyStore');


var RequestStore = {
    _items: [],
    _listeners: [],
    getItems: function() {
        return this._items;
    },
    setItems: function(items){
        this._items = items;
        this.notifyListeners(items);
        return {};
    },
    notifyListeners: function(items){
        for (var t = 0; t < this._listeners.length; t++) {
            this._listeners[t](items);
        }
    },
    addListener: function(listener) {
        this._listeners.push(listener);
    },
    clearListeners: function(){
        this._listeners = [];
    }
};

module.exports = RequestStore;
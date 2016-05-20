'use strict';

var React = require('react-native');
var {
  AsyncStorage
} = React;
var LocalKeyStore  = require('../Stores/LocalKeyStore');
import { EventEmitter } from "events";
import {events} from "../Constants/Events";


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
    }
};

module.exports = DriverStore;
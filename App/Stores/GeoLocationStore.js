'use strict';

var React = require('react-native');
var {
    AsyncStorage
    } = React;

var Geolocation = require('Geolocation');
import { EventEmitter } from "events";
import {events} from "../Constants/Events";


var GeoLocationStore = {
    _listeners: [],
    _geoLocation: {},

    get: function (callback) {
        return this._geoLocation;
        // return LocalKeyStore.getKey('currentUser', callback);
    },

    refresh: function (callback) {
        Geolocation.getCurrentPosition((geoPosition) => {
            if (callback) {
                callback(geoPosition.coords);
            }
            this.set(geoPosition.coords);
        });
    },

    startWatching: function () {
        Geolocation.watchPosition((geoPosition) => {
            this.set(geoPosition.coords);
        });
    },

    stopWatching: function () {
        Geolocation.stopObserving();
    },

    set: function (geoPosition) {
        this._geoLocation = geoPosition;
        this.notifyListeners(geoPosition);
        //return LocalKeyStore.setKey('geoPosition', geoPosition);
    },

    notifyListeners: function (geoPosition) {
        for (var t = 0; t < this._listeners.length; t++) {
            this._listeners[t](geoPosition);
        }
    },

    addListener: function (listener) {
        this._listeners.push(listener);
    }
};

module.exports = GeoLocationStore;
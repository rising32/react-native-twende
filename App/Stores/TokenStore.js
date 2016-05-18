'use strict';

var React = require('react-native');
var {
    AsyncStorage
} = React;


var TokenStore = {
    _token: null,
    get: function (callback) {
        if (!this._token) {
            AsyncStorage.getItem('token').then((token) => {
                this._token = token;
                return token;
            });
        } else {
            return this._token;
        }
    },
    set: function (token, callback) {
        this._token = token;
        AsyncStorage.setItem('token', token, () => {
            callback(token);
        });
    }
};

module.exports = TokenStore;
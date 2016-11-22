'use strict';

var ReactNative = require('react-native');
var {
    AsyncStorage,
    } = ReactNative;
import { EventEmitter } from "events";
import events from "../Constants/Events";
import actions from "../Constants/Actions";
import dispatcher from "../Dispatcher";


class TokenStore extends EventEmitter {

    constructor() {
        super();
        this._token = null;

    };

    get(callback) {
        if (this._token) {
            return this._token;
        }
        AsyncStorage.getItem('token').then((token) => {
            this._token = token;
            return token;
        });
    };

    set(token) {
        this._token = token;
        AsyncStorage.setItem('token', token);
    };

    setFbToken(token) {
        this._fbToken = token;
        AsyncStorage.setItem('fbToken', token);
    };

    getFbToken(token) {
        if (this._fbToken) {
            return this._fbToken;
        }
        AsyncStorage.getItem('fbToken').then((token) => {
            this._fbToken = token;
            return token;
        });
    };

    clear() {
        AsyncStorage.removeItem('token');
        this._token = null;
    };

    handleActions(action) {
        switch(action.type) {
            case actions.receiveToken:
                this.set(action.token);
                break;
            case actions.receiveFacebookToken:
                this.setFbToken(action.token);
                break;
            case actions.logoutCurrentUser:
                this.clear();
                break;

        }
    };
}

const tokenStore = new TokenStore;

dispatcher.register(tokenStore.handleActions.bind(tokenStore));

module.exports = tokenStore;

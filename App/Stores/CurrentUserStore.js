'use strict';

var React = require('react-native');
var {
  AsyncStorage
} = React;
var LocalKeyStore  = require('../Stores/LocalKeyStore');
var TokenStore  = require('../Stores/TokenStore');

import { EventEmitter } from "events";
import events from "../Constants/Events";
import actions from "../Constants/Actions";
import dispatcher from "../Dispatcher";


class CurrentUserStore extends EventEmitter {

    constructor() {
        super();
        this._currentUser = {};
        this._gcmToken = '';
    };

    get() {
        return this._currentUser;
    };

    set(currentUser){
        this._currentUser = currentUser;
        this.emit(events.currentUserLoaded, currentUser);
    };

    setGcmToken(gcmToken) {
        if (this._gcmToken != gcmToken) {
            this._gcmToken = gcmToken;
            this.emit(events.gcmTokenLoaded, gcmToken);
        }
    };

    clear() {
        this._currentUser = {};
        this.emit(events.userLoggedOut);
    };

    error() {
        this._currentUser = {};
        this.emit(events.noCurrentUser);
    };

    handleActions(action) {
        switch(action.type) {
            case actions.receiveCurrentUser:
                this.set(action.currentUser);
                break;
            case actions.setGcmToken:
                this.setGcmToken(action.gcmToken);
                break;
            case actions.logoutCurrentUser:
                this.clear();
                break;
            case actions.errorFetchCurrentUser:
                this.error();
                break;
        }
    };
}


const currentUserStore = new CurrentUserStore;

dispatcher.register(currentUserStore.handleActions.bind(currentUserStore));

export default currentUserStore;
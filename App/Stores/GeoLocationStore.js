'use strict';

var React = require('react-native');
var {
    AsyncStorage
    } = React;

import { EventEmitter } from "events";
import events from "../Constants/Events";
import actions from "../Constants/Actions";
import dispatcher from "../Dispatcher";


class GeoLocationStore extends EventEmitter {

    constructor() {
        super();
        this._geoLocation = {};

    };

    get() {
        return this._geoLocation;
    };

    set(geoPosition) {
        this._geoLocation = geoPosition;
        this.emit(events.geoPositionLoaded, geoPosition)
    };

    handleActions(action) {
        switch(action.type) {
            case actions.seLocation:
                this.set(action.location);
                break;
            case actions.refreshLocation:
                this.error();
                break;
        }
    };
}


const geoLocationStore = new GeoLocationStore;

dispatcher.register(geoLocationStore.handleActions.bind(geoLocationStore));

export default geoLocationStore;


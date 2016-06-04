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

    set(location) {
        this._geoLocation = location;
        this.emit(events.geoLocationLoaded, location)
    };

    handleActions(action) {
        switch(action.type) {
            case actions.receiveGeoLocation:
                this.set(action.location);
                break;
        }
    };
}


const geoLocationStore = new GeoLocationStore;

dispatcher.register(geoLocationStore.handleActions.bind(geoLocationStore));

export default geoLocationStore;


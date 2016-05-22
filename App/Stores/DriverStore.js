'use strict';

var React = require('react-native');
var {
  AsyncStorage
} = React;

import { EventEmitter } from "events";
import events from "../Constants/Events";
import actions from "../Constants/Actions";
import dispatcher from "../Dispatcher";


class DriverStore extends EventEmitter {

    constructor() {
        super();
        this._drivers = {};

    };

    getList() {
        return this._drivers;
    };

    setList(drivers){
        this._drivers = drivers;
        this.emit(events.driverListLoaded, drivers);
    };

    error() {
        this._drivers = {};
        this.emit(events.errorLoadingDrivers);
    };

    handleActions(action) {
        switch(action.type) {
            case actions.receiveDriverList:
                this.setList(action.driverList);
                break;
            case actions.errorFetchDriverList:
                this.error();
                break;
        }
    };
}


const driverStore = new DriverStore;

dispatcher.register(driverStore.handleActions.bind(driverStore));

export default driverStore;
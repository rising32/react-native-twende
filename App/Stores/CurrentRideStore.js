'use strict';

var React = require('react-native');
import { EventEmitter } from "events";
import events from "../Constants/Events";
import actions from "../Constants/Actions";
import dispatcher from "../Dispatcher";


class CurrentRideStore extends EventEmitter {

    constructor() {
        super();
        this._ride = {};

    };

    get() {
        return this._ride;
    };

    set(ride){
        this._ride = ride;
        this.emit(events.currentRideLoaded, ride);
    };

    error() {
        this._ride = {};
        this.emit(events.errorLoadingCurrentRide);
    };

    handleActions(action) {
        switch(action.type) {
            case actions.receiveCurrentRide:
                this.set(action.ride);
                break;
            case actions.errorCreateCurrentRide:
                this.error(actions.error);
                break;
            case actions.receiveRideList:
                this.set(action.rides[0]);
                break;
            case actions.errorLoadRideList:
                this.error(actions.error);
                break;
        }
    };
}


const currentRideStore = new CurrentRideStore;

dispatcher.register(currentRideStore.handleActions.bind(currentRideStore));

export default currentRideStore;
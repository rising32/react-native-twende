var GeoLocationStore = require('../Stores/GeoLocationStore');
var RideService = require('../Services/RideService');

import dispatcher from "../Dispatcher";
import actions from "../Constants/Actions";
import {dispatch} from '../Dispatcher';


export function createCurrentRide(ride) {

    dispatch({
        type: actions.createCurrentRide
    });
    RideService.create(
        ride,
        (currentRide) => {
            dispatch({
                type: actions.receiveCurrentRide,
                ride: currentRide
            });
        },
        (error) => {
            dispatch({
                type: actions.errorCreateCurrentRide
            })
        }
    );
}


export function refreshCurrentRide(ride) {

    dispatch({
        type: actions.fetchCurrentRide
    });
    RideService.refresh(
        ride,
        (currentRide) => {
            dispatch({
                type: actions.receiveCurrentRide,
                ride: currentRide
            });
        },
        (error) => {
            dispatch({
                type: actions.errorUpdaCurrentRide
            })
        }
    );
}

export function updateCurrentRide(ride) {

    dispatch({
        type: actions.updateCurrentRide
    });
    RideService.update(
        ride,
        (currentRide) => {
            dispatch({
                type: actions.receiveCurrentRide,
                ride: currentRide
            });
        },
        (error) => {
            dispatch({
                type: actions.errorUpdaCurrentRide
            })
        }
    );
}


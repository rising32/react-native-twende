var GeoLocationStore = require('../Stores/GeoLocationStore');
var RideService = require('../Services/RideService');

import dispatcher from "../Dispatcher";
import actions from "../Constants/Actions";
import {dispatch} from '../Dispatcher';
import {sendError} from "../Actions/ErrorLogActions";


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
                type: actions.errorUpdateCurrentRide
            })
        }
    );
}

export function loadRideList() {

    RideService.loadList(
        (rides) => {
            dispatch({
                type: actions.receiveRideList,
                rides: rides
            });
        },
        (error) => {
            dispatch({
                type: actions.errorLoadRideList
            })
        }
    );
}


export function loadCurrentRide(ride) {

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


export function updateCurrentRide(currentRide) {

    dispatch({
        type: actions.updateCurrentRide
    });
    RideService.update(
        currentRide,
        (currentRide) => {
            sendError("INFO", "Success loading ride ", null, currentRide.id);
            dispatch({
                type: actions.receiveCurrentRide,
                ride: currentRide
            });
        },
        (error) => {
            sendError("ERROR", "Error loading ride ", error, currentRide);
            alert("Something went wrong. Please logout en login again.");
            dispatch({
                type: actions.errorUpdaCurrentRide
            })
        }
    );
}


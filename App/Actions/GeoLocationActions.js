var Geolocation = require('Geolocation');
import {dispatch} from '../Dispatcher';
import actions from "../Constants/Actions";
import config from "../../config"

export function loadGeoLocation() {
    Geolocation.getCurrentPosition((location) => {
        dispatch({
            type: actions.receiveGeoLocation,
            location: location.coords
        });
    });
}

export function startWatchingGeoLocation() {
    Geolocation.watchPosition(
        (location) => {
            dispatch({
                type: actions.receiveGeoLocation,
                location: location.coords
            });
        },
        (error) => {},
        {maximumAge: config.geoPositionMaxAge * 1000} // 60 seconds
    );
}

export function stopWatchingGeoLocation() {
    Geolocation.stopObserving();
}


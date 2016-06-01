var Geolocation = require('Geolocation');
import {dispatch} from '../Dispatcher';
import actions from "../Constants/Actions";
import config from "../../config"

export function loadGeoLocation() {
    Geolocation.getCurrentPosition((position) => {
        dispatch({
            type: actions.receiveGeoPosition,
            position: position.coords
        });
    });
}

export function startWatchingGeoLocation() {
    Geolocation.watchPosition(
        (position) => {
            dispatch({
                type: actions.receiveGeoPosition,
                position: position.coords
            });
        },
        (error) => {},
        {maximumAge: config.geoPositionMaxAge * 1000} // 60 seconds
    );
}

export function stopWatchingGeoLocation() {
    Geolocation.stopObserving();
}


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
        (error) => {
        },
        {maximumAge: config.geoPositionMaxAge * 1000} // 60 seconds
    );
}

export function stopWatchingGeoLocation() {
    Geolocation.stopObserving();
}


export function startBackgroundGeoLocation() {

    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.on('location', function (location) {
        console.log('- [js]location: ', JSON.stringify(location));
    });

    // This handler fires whenever bgGeo receives an error
    BackgroundGeolocation.on('error', function (error) {
        var type = error.type;
        var code = error.code;
        alert(type + " Error: " + code);
    });

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.on('motionchange', function (location) {
        console.log('- [js]motionchanged: ', JSON.stringify(location));
    });

    BackgroundGeolocation.start(function () {
        console.log('- [js] BackgroundGeolocation started successfully');

        // Fetch current position
        BackgroundGeolocation.getCurrentPosition({timeout: 30}, function (location) {
            console.log('- [js] BackgroundGeolocation received current position: ', JSON.stringify(location));
        }, function (error) {
            alert("Location error: " + error);
        });
    });

    // Call #stop to halt all tracking
    // BackgroundGeolocation.stop();
}
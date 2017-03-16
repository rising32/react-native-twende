var Geolocation = require('Geolocation');
import {dispatch} from '../Dispatcher';
import actions from "../Constants/Actions";
import config from "../config"
var LocationService = require('../Services/LocationService');
var React = require('react-native');
var watchId;

export function loadGeoLocation(enableHighAccuracy) {
    if (undefined == enableHighAccuracy) enableHighAccuracy = false;
    Geolocation.getCurrentPosition(
        (geoLocation) => {
            var location = {
                latitude: geoLocation.coords.latitude,
                longitude: geoLocation.coords.longitude
            };
            // Dispatch it for application
            dispatch({
                type: actions.receiveGeoLocation,
                location: location
            });
            //Send the location to the api
            LocationService.storeLocation(
                location,
                (location) => {
                },
                (error) => {
                    console.log(error);
                }
            );
        },
        (error) => {
            loadGeoLocation(enableHighAccuracy)
        },
        {
            timeout: (config.geoPositionTimeOut * 3000),
            maximumAge: (config.geoPositionMaxAge * 10000),
            enableHighAccuracy: enableHighAccuracy
        }
    );
}

export function startWatchingGeoLocation() {
    watchId = Geolocation.watchPosition(
        (geoLocation) => {
            var location = {
                latitude: geoLocation.coords.latitude,
                longitude: geoLocation.coords.longitude
            };
            // Dispatch it for the application
            dispatch({
                type: actions.receiveGeoLocation,
                location: location
            });
            //Send the location to the api
            LocationService.storeLocation(
                location,
                (location) => {
                },
                (error) => {
                    console.log(JSON.stringify(error));
                }
            );
        },
        (error) => {
        },
        {
            timeout: (config.geoPositionTimeOut * 1000),
            maximumAge: (config.geoPositionMaxAge * 1000),
            enableHighAccuracy: false
        }
    );
}

export function stopWatchingGeoLocation() {
    Geolocation.clearWatch(watchId);
    watchId = null;
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
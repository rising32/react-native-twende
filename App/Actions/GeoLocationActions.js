var Geolocation = require('Geolocation');
import {dispatch} from '../Dispatcher';
import actions from "../Constants/Actions";
import config from "../config"
var LocationService = require('../Services/LocationService');
var React = require('react-native');
var watchId;

export function loadGeoLocation(enableHighAccuracy) {
    if (undefined == enableHighAccuracy) enableHighAccuracy = false;
    navigator.geolocation.getCurrentPosition(
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
    watchId = navigator.geolocation.watchPosition(
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
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
}

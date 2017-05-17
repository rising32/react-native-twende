var Geolocation = require('Geolocation');
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
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


    BackgroundGeolocation.on('location', (location) => {
        dispatch({
            type: actions.receiveGeoLocation,
            location: location
        });

        // Send the location to the api
        LocationService.storeLocation(
            location,
            (location) => {
            },
            (error) => {
                sendError("ERROR", "Error saving location", error);
            }
        );
    });

    BackgroundGeolocation.on('stationary', (location) => {
        dispatch({
            type: actions.receiveGeoLocation,
            location: location
        });

        // Send the location to the api
        LocationService.storeLocation(
            location,
            (location) => {
            },
            (error) => {
                sendError("ERROR", "Error saving location", error);
            }
        );
    });

    BackgroundGeolocation.on('error', (error) => {
        sendError("ERROR", "Error getting location", error);
    });


    BackgroundGeolocation.start(() => {
        console.log('[DEBUG] BackgroundGeolocation started successfully');
    });

}

export function stopWatchingGeoLocation() {

    BackgroundGeolocation.stop(() => {
        console.log('[DEBUG] BackgroundGeolocation stopped successfully');
    });

    // navigator.geolocation.clearWatch(watchId);
    // watchId = null;
}

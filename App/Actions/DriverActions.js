'use strict';

var React = require('react-native');
var {
    AsyncStorage
} = React;

var DriverService = require('../Services/DriverService');
var GeoLocationStore = require('../Stores/GeoLocationStore');

import dispatcher from "../Dispatcher";
import actions from "../Constants/Actions";
import {dispatch} from '../Dispatcher';


export function loadDriverList(position) {


    dispatch({
        type: actions.fetchDriverList
    });


    GeoLocationStore.refresh((pos) => {
        DriverService.loadDriverList(
            position,
            (driverList) => {
                dispatch({
                    type: actions.receiveDriverList,
                    driverList: driverList
                })
            },
            (error) => {
                dispatch({
                    type: actions.errorFetchDriverList
                })
            }
        );
    });
}
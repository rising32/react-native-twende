'use strict';

var DriverService = require('../Services/DriverService');
var GeoLocationStore = require('../Stores/GeoLocationStore');

import dispatcher from "../Dispatcher";
import actions from "../Constants/Actions";
import {dispatch} from '../Dispatcher';


export function loadDriverList(location) {


    dispatch({
        type: actions.fetchDriverList
    });

    if (!location) {
        dispatch({
            type: actions.errorFetchDriverList,
            error: 'Need a position to get a list of drivers.'
        });
        return
    }
    DriverService.loadDriverList(
        location,
        (driverList) => {
            dispatch({
                type: actions.receiveDriverList,
                driverList: driverList
            })
        },
        (error) => {
            dispatch({
                type: actions.errorFetchDriverList,
                error: error
            })
        }
    );
}
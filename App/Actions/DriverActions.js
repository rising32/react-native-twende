'use strict';

var React = require('react-native');
var {
    AsyncStorage
} = React;

var DriverService = require('../Services/DriverService');
var GeoLocationStore = require('../Stores/GeoLocationStore');

import dispatcher from "../Dispatcher";
import actions from "../Constants/Actions";


export function loadDriverList() {
    GeoLocationStore.refresh((position) => {
        DriverService.getList(position);
    });
}
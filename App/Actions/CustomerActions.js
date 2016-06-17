'use strict';

var React = require('react-native');
var {
    AsyncStorage
} = React;

var CustomerService = require('../Services/CustomerService');
var GeoLocationStore = require('../Stores/GeoLocationStore');

import dispatcher from "../Dispatcher";
import actions from "../Constants/Actions";
import {dispatch} from '../Dispatcher';


export function loadCustomerList(location) {

    dispatch({
        type: actions.fetchCustomerList
    });

    CustomerService.loadCustomerList(
        location,
        (customerList) => {
            dispatch({
                type: actions.receiveCustomerList,
                customerList: customerList
            })
        },
        (error) => {
            dispatch({
                type: actions.errorFetchCustomerList
            })
        }
    );
}
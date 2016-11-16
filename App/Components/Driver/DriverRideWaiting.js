'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    } = ReactNative;


var CurrentUserStore = require('../Stores/CurrentUserStore');
var GeoLocationStore = require('../Stores/GeoLocationStore');
import CustomerStore from '../Stores/CustomerStore';
var IconText = require('../Components/IconText');
import {colors, styles} from "../Styles";


var DriverRideWaiting = React.createClass({

    render: function() {
        return  (
            <View style={{alignItems: 'center'}}>
                <IconText
                    icon={"schedule"}
                    text={"Waiting for a ride"}
                    color={colors.action_secondary}
                    style={{margin: 10}}
                />
            </View>
        );
    }
});


module.exports = DriverRideWaiting;

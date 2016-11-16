'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Text,
    } = ReactNative;

import {colors, styles} from "../../Styles";


var ToggleAvailability = React.createClass({

    toggleAvailability: function(available) {
        var currentUser = this.state.currentUser;
        currentUser.is_available = available.checked;
        this.setState({currentUser: currentUser});
    },

    render: function(route, navigator) {
        return (
            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around'}}>
                <Text>
                    Not available
                </Text>
                <Text>
                    Available
                </Text>
            </View>
        );
    }
});

module.exports = ToggleAvailability;

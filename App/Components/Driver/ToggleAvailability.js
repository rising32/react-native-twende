'use strict';

var React = require('react-native');
var {
    View,
    Text,
    } = React;

import {
    MKSwitch,
} from 'react-native-material-kit';

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
                <MKSwitch
                    color={colors.action}
                    onCheckedChange={this.toggleAvailability}
                    checked={this.state.currentUser.is_available}
                />
                <Text>
                    Available
                </Text>
            </View>
        );
    }
});

module.exports = ToggleAvailability;

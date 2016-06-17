'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    TouchableOpacity
    } = ReactNative;
import {colors, styles} from "../Styles";
import { Icon } from 'react-native-material-design';
var Avatar = require('../Components/Avatar');


var SheetIcon = React.createClass({

    render: function () {
        return (
            <View style={{alignItems: 'center', marginTop: -50, marginBottom: -15, elevation: 5}}>
                <Avatar image={this.props.image} />
            </View>
        );
    }
});

module.exports = SheetIcon;

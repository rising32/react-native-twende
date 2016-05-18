'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Text,
    View,
    } = ReactNative;
import {colors, styles} from "../Styles";
import { Icon } from 'react-native-material-design';


var Iconed = React.createClass({

    render: function () {
        var color = this.props.color || colors.action;
        var size = this.props.size || 16;
        return (
            <View style={[this.props.style, {flexDirection: 'row', alignItems: 'center'}]}>
                <Icon name={this.props.icon}
                      color={color}
                      size={size}
                      style={{marginRight: size/2}}/>
                {this.props.children}
            </View>
        );
    }
});

module.exports = Iconed;
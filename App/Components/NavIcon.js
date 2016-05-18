'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Linking,
    Text,
    TouchableOpacity,
    TouchableNativeFeedback,
    View,
    } = ReactNative;
import {colors, styles} from "../Styles";
import { Icon } from 'react-native-material-design';


var NavIcon = React.createClass({

    propTypes: {
        url: React.PropTypes.string
    },

    render: function () {
        return (
            <View style={styles.nav_icon}>
                <TouchableOpacity onPress={this.props.action}>
                    <Icon
                        name={this.props.icon}
                        color={colors.nav_text}
                        size={20}
                    />
                </TouchableOpacity>
            </View>
        );
    }
});

module.exports = NavIcon;


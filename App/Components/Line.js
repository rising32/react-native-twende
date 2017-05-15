'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Image
    } = ReactNative;
import {colors, styles} from "../Styles";

var Line = React.createClass({
 	render: function () {
	    return (
	            <View style={styles.line}>
	            </View>
        );
    }
});

module.exports = Line;

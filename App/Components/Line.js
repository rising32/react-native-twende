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
	            <Image
	                source={require('../assets/line.png')}
	                style={styles.line}
	            />
        );
    }
});

module.exports = Line;

'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Image
    } = ReactNative;
import {colors, styles} from "../Styles";

var Banner = React.createClass({
 	render: function () {
	    return (
			<Image
                source={require('../assets/banner.jpg')}
                style={styles.banner}
            />
        );
    }
});

module.exports = Banner;
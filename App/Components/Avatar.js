'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Image
    } = ReactNative;

import {colors, styles} from "../Styles";
var config = require('../config');

var Avatar = React.createClass({

    render: function () {
        return (
            <Image
                source={{uri: config.mediaUrl + this.props.image}}
                style={{
                    width: 70,
                    height: 70,
                    borderRadius: 40,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }}
            />
        );
    }
});

module.exports = Avatar;

'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    Image,
    View
    } = ReactNative;

import {colors, styles} from "../Styles";
const config = require('../config');

module.exports = React.createClass({

    render: function () {
        // Default avatar
        let avatar = require('../assets/twende_avatar.png')
        let style = styles.avatar;

        // Use specified avatar
        if (this.props.image) {
            avatar = {uri: config.mediaUrl + this.props.image}
        }

        if (this.props.style) {
            style = this.props.style;
        }   

        return (
            <View style={[styles.avatar_centre, {justifyContent: this.props.justify}]}>
                <Image
                    source={avatar}
                    style={style}
                />
            </View>
        );
    }
});

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

        // Use specified avatar
        if (this.props.image) {
            avatar = {uri: config.mediaUrl + this.props.image}
        }
        return (
            <View style={styles.avatar_centre}>
                <Image
                    source={avatar}
                    style={styles.avatar}
                />
            </View>
        );
    }
});

'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Text,
    View,
    Image,
    TouchableOpacity
    } = ReactNative;

import {colors, styles} from "../Styles";
var Rating = require('../Components/Rating');
var IconText = require('../Components/IconText');
var config = require('../../config');


var DriverItem = React.createClass({

    fuzzyDistance: function() {
        let dist = this.props.driver.distance;
        if (dist > 1000) {
            return Math.round(dist / 100) / 10 + 'km';
        }
        return Math.round(dist)  + 'm';
    },

    render: function () {
        return (
            <View style={styles.item}>
                <View style={styles.item_content}>
                    <Image
                        source={{uri: config.mediaUrl + this.props.driver.avatar}}
                        style={styles.item_image}
                    />
                    <View style={{flex: 1}}>
                        <TouchableOpacity
                            style={styles.item_details}
                            onPress={this.props.onSelect}
                        >
                            <Text style={styles.item_title}>
                                {this.props.driver.name}
                            </Text>
                            <IconText icon="motorcycle"
                                      size={16}
                                      color={colors.secondary}
                                      text={this.fuzzyDistance()} />
                            <View style={{width: 100}}>
                                <Rating
                                    maxStars={5}
                                    rating={this.props.driver.rating}
                                    colorOn={colors.secondary}
                                    colorOff={colors.action_disabled}
                                />
                            </View>
                            <Text style={styles.item_action}>
                                Request a ride
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
});

module.exports = DriverItem;

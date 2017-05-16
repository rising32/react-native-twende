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
var SheetIcon = require('../Components/SheetIcon');
var Rating = require('../Components/Rating');
var IconText = require('../Components/IconText');
var ButtonListview = require('../Components/ButtonListview');
var config = require('../config');



var DriverItem = React.createClass({

    fuzzyDistance: function() {
        let dist = this.props.driver.distance;
        if (dist > 1000) {
            return Math.round(dist / 100) / 10 + 'km (' + (((dist / 100) / 10) * 4).toFixed(0) + ' min)';
        }
        if (dist > 240) {
        return Math.round(dist)  + 'm (' + (((dist / 100) / 10) * 4).toFixed(0) + ' min)';
        }
        return Math.round(dist)  + 'm (' + (((dist / 100) / 10) * 4 * 60).toFixed(0) + ' sec)';
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
                        <View
                            style={styles.item_details}
                            onPress={this.props.onSelect}
                        >
                            <Text style={styles.list_title}>
                                {this.props.driver.name}
                            </Text>
                            <IconText icon="motorcycle"
                                      size={14}
                                      color={colors.action}
                                      text={this.fuzzyDistance()} />
                            <View style={{width: 100}}>
                                <Rating
                                    maxStars={5}
                                    rating={this.props.driver.rating}
                                    colorOn={colors.secondary}
                                    colorOff={colors.action_disabled}
                                    size={16}
                                />
                            </View>
                            
                                <ButtonListview 
                                    action={this.props.onSelect}
                                    text={"REQUEST"} 
                                />
                            
                        </View>
                    </View>
                </View>
            </View>
        );
    }
});

module.exports = DriverItem;

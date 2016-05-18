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
var IconText = require('../Components/IconText');


var DriverItem = React.createClass({

    showDriverDetails: function(){
        alert(`Show details for ${this.props.driver.name}...`);
    },

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
                        source={{uri: 'http://twende.loekvan.gent/' + this.props.driver.avatar}}
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

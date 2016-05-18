'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Text,
    View,
    } = ReactNative;

import {colors, styles} from "../Styles";


var Circle = React.createClass({
    render: function () {
        var color = this.props.on ? colors.action : '#eeeeee';

        return (

            <View
                style={{borderRadius: 25,
                        backgroundColor: '#eeeeee',
                        width: 50,
                        height: 50,
                        margin: 1,
                        alignItems: 'center'

                }}
            >
                <View
                    style={{borderRadius: 15,
                            backgroundColor: color,
                            width: 24,
                            height: 24,
                            alignItems: 'center',
                            marginTop: 13
                    }}
                >
                    <View
                        style={{borderRadius: 5,
                                backgroundColor: '#cccccc',
                                width: 10,
                                height: 10,
                                marginTop: 7
                        }}
                    />
                </View>
            </View>
        );
    }
});

var StepBar = React.createClass({

    render: function () {
        return (
            <View style={styles.step_bar}>
                <View style={styles.step}>
                    <Circle on={true}/>
                    <Text style={styles.step_title}>
                        Ride requested
                    </Text>
                </View>
                <View style={styles.step}>
                    <Circle on={false}/>
                    <Text style={styles.step_title}>
                        Driver on his way
                    </Text>
                </View>
                <View style={styles.step}>
                    <Circle on={false}/>
                    <Text style={styles.step_title}>
                        En route
                    </Text>
                </View>
            </View>
        );
    }
});

module.exports = StepBar;

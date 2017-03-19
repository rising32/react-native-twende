'use strict';

var ReactNative = require('react-native');
var React = require('react');
var {
    View,
    Image,
    } = ReactNative;
import {colors, styles} from "../Styles";

var SplashPage = React.createClass({

    render: function() {
        return (
            <View style={styles.splash}>
                  <View style={{flex: 0.4}}></View>


                <View style={{flex: 0.4}}>
                    <Image
                        source={require('../assets/splash.jpg')}
                        style={styles.splash_title}
                        />
                </View>
                <View>
                    <Image
                        source={require('../assets/banner.jpg')}
                        style={styles.banner_splash}
                        />
                </View>
            </View>
        );
    }
});

module.exports = SplashPage;

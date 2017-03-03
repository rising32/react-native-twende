'use strict';

var ReactNative = require('react-native');
var React = require('react');
var {
    View,
    Image,
    } = ReactNative;
var TokenStore = require('../Stores/TokenStore');
import {colors, styles} from "../Styles";

import events from "../Constants/Events";
import CurrentUserStore from '../Stores/CurrentUserStore';
import { reloadCurrentUser }  from '../Actions/CurrentUserActions';


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
                <View style={{flex: 0.6}}>
                    <Image
                        source={require('../assets/banner.jpg')}
                        style={styles.banner}
                        />
                </View>
            </View>
        );
    }
});

module.exports = SplashPage;

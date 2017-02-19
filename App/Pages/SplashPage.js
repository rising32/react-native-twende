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
                <Image
                    source={require('../assets/splash.jpg')}
                    style={styles.splash_title}
                    />
                <Image
                    source={require('../assets/banner.jpg')}
                    style={styles.banner}
                    />
            </View>
        );
    }
});

module.exports = SplashPage;

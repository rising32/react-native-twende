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

    getInitialState: function(){
        return {
            currentUser: {}
        }
    },

    componentWillMount: function() {
        var navigator = this.props.navigator;
        CurrentUserStore.on(events.currentUserLoaded, this.goToHome);
        CurrentUserStore.on(events.noCurrentUser, this.goToLogin);
        reloadCurrentUser();
    },

    removeListeners: function() {
        CurrentUserStore.removeListener(events.currentUserLoaded, this.goToHome);
        CurrentUserStore.removeListener(events.noCurrentUser, this.goToLogin);

    },

    componentWillUnmount: function() {
      this.removeListeners();
    },

    goToLogin: function () {
        this.setState({currentUser: {}});
        this.props.goToPage('LoginPage');
    },

    goToHome: function (currentUser) {
        this.setState({currentUser: currentUser});
        if (currentUser.is_driver) {
            this.removeListeners();
            this.props.navigator.push({id: 'DriverHomePage', currentUser: currentUser});
        } else {
            this.removeListeners();
            this.props.navigator.push({id: 'CurrentLocationPage', currentUser: currentUser});
        }
    },


    render: function() {
        return (
            <View style={styles.splash}>
                <Image
                    source={require('../assets/splash.png')}
                    style={{width: 300, height: 300}}
                    />
            </View>
        );
    }
});

module.exports = SplashPage;

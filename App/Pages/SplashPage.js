'use strict';

var React = require('react-native');
var {
    View,
    Text,
    Image,
    } = React;
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

    goToLogin: function () {
        this.setState({currentUser: {}});
        this.props.goToPage('LoginPage');
    },

    goToHome: function (currentUser) {
        this.setState({currentUser: currentUser});
        if (currentUser.is_driver) {
            this.props.navigator.replace({id: 'DriverHomePage', currentUser: currentUser});
        } else {
            this.props.navigator.replace({id: 'CurrentLocationPage', currentUser: currentUser});
        }
    },

    componentWillUnmount: function() {
        CurrentUserStore.removeListener(events.currentUserLoaded, this.goToHome);
        CurrentUserStore.removeListener(events.noCurrentUser, this.goToLogin);
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

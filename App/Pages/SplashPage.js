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
        if (currentUser.is_driver) {
            this.props.goToPage('DriverHomePage');
        } else {
            this.props.goToPage('CurrentLocationPage');
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
                    source={require('../assets/title-image.png')}
                    />
                <Image
                    source={require('../assets/title.png')}
                    />
            </View>
        );
    }
});

module.exports = SplashPage;

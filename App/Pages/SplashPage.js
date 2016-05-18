'use strict';

var React = require('react-native');
var {
    View,
    Text,
    Image,
    } = React;
var TokenStore = require('../Stores/TokenStore');
var CurrentUserActions = require('../Actions/CurrentUserActions');
var CurrentUserStore = require('../Stores/CurrentUserStore');
import {colors, styles} from "../Styles";

var SplashPage = React.createClass({

    componentWillMount: function() {
        var navigator = this.props.navigator;
        CurrentUserStore.addListener((currentUser) => {
            if (currentUser) {
                if (currentUser.is_driver) {
                    this.props.goToPage('DriverHomePage');
                } else {
                    this.props.goToPage('CurrentLocationPage');
                }
            } else {
                navigator.replace({
                    id: 'LoginPage'
                });
            }
        });
        CurrentUserActions.reloadUser();
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

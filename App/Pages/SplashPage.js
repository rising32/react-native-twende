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

    componentWillMount: function() {
        var navigator = this.props.navigator;
        CurrentUserStore.on(events.currentUserLoaded, (currentUser) => {
            if (currentUser.is_driver) {
                this.props.goToPage('DriverHomePage');
            } else {
                this.props.goToPage('CurrentLocationPage');
            }
        });
        reloadCurrentUser();
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

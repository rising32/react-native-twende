'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    ScrollView,
    View,
    Text,
    Navigator,
    StyleSheet
    } = ReactNative;

import {colors, styles} from "../Styles";
var IconText = require('../Components/IconText');
import events from "../Constants/Events";
var NavIcon = require('../Components/NavIcon');
var Link = require('../Components/Link');
import Dispatcher from "../Dispatcher";
import CurrentUserStore from '../Stores/CurrentUserStore';
import { loginCurrentUser }  from '../Actions/CurrentUserActions';
import { loadFacebookUser }  from '../Actions/SocialActions';

var htmlStyle = StyleSheet.create({
    h1: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 5,
        marginTop: 5
    },
    h2: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
        marginTop: 5
    },
    p: {
        marginBottom: 5,
        marginTop: 5
    },
    i: {
        fontStyle: 'italic'
    }
});


var CustomerSupportPage = React.createClass({

    render: function () {
        return (
            <Navigator
                renderScene={this.renderScene}
                navigator={this.props.navigator}
                navigationBar={
            <Navigator.NavigationBar
                style={styles.nav_bar}
                routeMapper={NavigationBarRouteMapper} />
          }/>
        );
    },

    renderScene: function (route, navigator) {

        return (
            <View style={{marginTop: 50, padding:20, flex: 1}}>
                <Text style={htmlStyle.h1}>
                    Customer Support
                </Text>
                <Text>
                    You can call customer support at any time...
                </Text>
                <Link style={{margin: 10}}
                      url={"tel: 0791398120"}
                      icon={"phone"}
                      size={16}
                      iconSize={24}
                      color={colors.action}
                      text={"0791398120"}
                />

            </View>
        );
    }
});

var NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, nextState) {
        return (
            <NavIcon
                icon={"menu"}
                action={() => navigator.parentNavigator.props.drawer.openDrawer()}
            />
        );
    },
    RightButton(route, navigator, index, navState) {
        return null
    },
    Title(route, navigator, index, navState) {
        return (
            <Text style={styles.nav_title}>
                CUSTOMER SUPPORT
            </Text>
        );
    }
};

module.exports = CustomerSupportPage;

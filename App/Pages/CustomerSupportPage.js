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
            <View style={{marginTop: 50, padding: 40, flex: 1}}>
                <Text style={[styles.item_title, {color: colors.secondary}]}>
                    Call Us
                </Text>
                <View style={{marginTop: 16, marginBottom: 20}}>
                <Text>
                    Please call us on this number in case of any issues related to the ride. 
                    We also more than welcome any inquiries & feedback about our service.
                    We look forward speaking to you.
                    {"\n"}{"\n"}{"\n"}
                    For this beta test our customer service is open from 9 - 5 (Monday - Friday)
                </Text>
                </View>
                <Link style={{margin: 10}}
                      url={"tel: 0791398120"}
                      icon={"phone"}
                      size={20}
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
                icon={"arrow-back"}
                action={() => navigator.parentNavigator.pop()}
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

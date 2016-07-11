'use strict';

var React = require('react-native');
var {
    ScrollView,
    View,
    Text,
    Navigator,
    StyleSheet
    } = React;

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


var LoginPage = React.createClass({

    render: function () {
        return (
            <Navigator
                renderScene={this.renderScene}
                navigationBar={
            <Navigator.NavigationBar
                style={styles.nav_bar}
                routeMapper={NavigationBarRouteMapper} />
          }/>
        );
    },

    renderScene: function (route, navigator) {

        return (
            <View style={{flex: 1}}>
                <ScrollView style={{marginTop: 50, padding:20, flex: 1}}>
                    <Text style={htmlStyle.h1}>Twende Terms of Service</Text>
                    <Text style={[htmlStyle.i, htmlStyle.p]}>Last updated: June 28th, 2016</Text>
                    <Text style={htmlStyle.h2}>Introduction</Text>
                    <Text style={htmlStyle.p}>
                        The goal of Twende is to be a Service that is fun, reliable and easy to use for everyone. In order to achieve this it is important to set out certain rules and conditions when using the Twende Services. In this document we describe what terms & conditions apply when you use the Twende app, so that you know what we expect from you and from the other users of Twende.
                    </Text>
                    <Text style={htmlStyle.h2}>Definitions</Text>
                    <Text style={htmlStyle.p}>
                        Twende is a social sharing platform where transport carriers (“Service Providers”) can offer and advertise their services to customers (“Customers”). The purpose of Twende is to improve mobility of persons and goods, to increase convenience for customers and business in the transportation of services and goods. The Twende platform will hereafter be referred to as the “Services”. Twende is incorporated as Twende BV at Tuinstraat 42, Utrecht, The Netherlands.
                    </Text>
                    <Text style={htmlStyle.p}>
                        Customers can be either individuals that make use of the Twende services or business that make use of the Services for transportation of persons or transportation of goods. Services providers and customers are collectively referred to as “Users” of the Services.
                        As the purpose of Twende is to improve mobility of persons and goods, to increase convenience for customers and business in the transportation of services and goods, we expect you to use Twende in line with these goals and refrain from any other (illegal) activity when using the services.
                    </Text>
                    <Text style={htmlStyle.h2}>User Account</Text>
                    <Text style={htmlStyle.p}>
                        You have to create an account to use the Services of Twende. If you are under the age of 18 you are not allowed to make an account and not allowed to use the Services. Furthermore, you are not allowed to let other persons use your Account. You may not assign or otherwise transfer your Account to any other person or entity. When using the Services you are not allowed to cause nuisance, annoyance, inconvenience, or property damage to any other party including the Service Provider.
                        As a User you may be asked to provide proof of identity to access or use the Services. Although the services are open to be used by anyone from 18 years onwards, we are allowed to ask for any information that we deem relevant in allowing the services to you.
                        When you create an Account, you agree that we may send you informational text (SMS) messages, facebook messages and e-mails as part of the normal business operation of your use of the Services. You may opt-out of receiving any of these messages from Twende at any time by sending an email to us.
                    </Text>
                    <Text style={{height: 60}} />
                </ScrollView>
                <Link
                    action={() => this.props.navigator.pop()}
                    style={{padding: 10, justifyContent: 'center'}}
                    text={'Back'}
                    color={colors.action}
                />
            </View>
        );
    }
});

var NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, nextState) {
        return null
        //return (
        //    <NavIcon
        //        icon={"arrow-back"}
        //        action={() => {this.props.goBack()}}
        //    />
        //);
    },
    RightButton(route, navigator, index, navState) {
        return null
    },
    Title(route, navigator, index, navState) {
        return (
            <Text style={styles.nav_title}>
                TWENDE
            </Text>
        );
    }
};

module.exports = LoginPage;

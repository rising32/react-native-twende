/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Text,
    View,
    Navigator,
    TouchableOpacity,
    DrawerLayoutAndroid,
    PermissionsAndroid,
    BackAndroid,
    StatusBar,
    ToastAndroid
    } = ReactNative;

var SplashPage = require('./Pages/SplashPage');
var LoginPage = require('./Pages/LoginPage');
var ProfilePage = require('./Pages/ProfilePage');
var RequestRidePage = require('./Pages/RequestRidePage');
var CurrentRidePage = require('./Pages/CurrentRidePage');
var CurrentLocationPage = require('./Pages/CurrentLocationPage');
var DriverListPage = require('./Pages/DriverListPage');
var DriverHomePage = require('./Pages/DriverHomePage');
var NoNavigatorPage = require('./Pages/NoNavigatorPage');
var TermsPage = require('./Pages/TermsPage');

var Drawer = require('./Components/Drawer');
var Avatar = require('./Components/Avatar');
var IconText = require('./Components/IconText');
var Link = require('./Components/Link');
import { colors, styles } from "./Styles";
import { sounds } from "./Sounds";
import events from "./Constants/Events";
import CurrentUserStore from './Stores/CurrentUserStore';
import CurrentRideStore from './Stores/CurrentRideStore';
import {
    logoutCurrentUser,
    setGcmToken,
    updateCurrentUser } from './Actions/CurrentUserActions';
import { logoutFacebookUser }  from './Actions/SocialActions';
var PushNotification = require('react-native-push-notification');
import { notify } from "./Actions/NotifyActions"
import { refreshCurrentRide } from "./Actions/CurrentRideActions";


var TwendeApp = React.createClass({

    getInitialState: function (props) {
        return {
            currentUser: {},
            currentRide: {}
        };
    },

    openDrawer: function () {
        this.refs['DRAWER'].openDrawer()
    },
    closeDrawer: function () {
        this.refs['DRAWER'].closeDrawer()
    },

    logout: function () {
        this.closeDrawer();
        logoutCurrentUser();
        logoutFacebookUser();
    },

    goToPage: function (pageId) {
        this.closeDrawer();
        this.navigator.replace({
            id: pageId,
            currentUser: this.state.currentUser
        });
    },

    goBack: function () {
        this.navigator.pop();
    },

    goHome: function () {
        if (this.state.currentUser.is_driver) {
            this.navigator.push({
                id: 'DriverHomePage',
                currentUser: this.state.currentUser
            });
        } else {
            this.navigator.push({
                id: 'CurrentLocationPage',
                currentUser: this.state.currentUser
            });
        }

    },

    currentRideLoaded: function(currentRide) {
        ToastAndroid.show('Current Ride Loaded ' + currentRide.state, ToastAndroid.SHORT);

        // Ride already finished
        if (currentRide.state == 'finalized') {
            return this.goHome();
        }

        this.setState({currentRide: currentRide});

        if (this.state.currentUser.is_driver) {
            if (currentRide.state == 'requested') {
                sounds.alarm1.play();
            }
            this.navigator.push({
                id: 'DriverHomePage',
                currentUser: this.state.currentUser,
                currentRide: currentRide
            });

        } else {
            if (currentRide.state == 'canceled') {
                this.navigator.push({
                    id: 'CurrentLocationPage',
                    currentUser: this.state.currentUser
                });
            } else if (currentRide.state == 'new') {
                this.navigator.push({
                    id: 'DriverListPage',
                    currentUser: this.state.currentUser,
                    currentRide: currentRide
                });
            } else {
                this.navigator.push({
                    id: 'CurrentRidePage',
                    currentUser: this.state.currentUser,
                    currentRide: currentRide
                });
            }
        }
    },

    currentUserLoaded: function(currentUser) {
        if (currentUser) {
            this.setState({currentUser: currentUser});
            this.registerPushNotification();
        }
    },

    registerPushNotification: function () {
        if (!PushNotification.senderID || PushNotification.senderID == undefined) {
            PushNotification.configure({
                onRegister: function (token) {
                    setGcmToken(token.token);
                },
                onNotification: function (notification) {
                    if (notification.title) {
                        notify(notification.title, notification.message);
                    }
                    if (notification.ride) {
                        refreshCurrentRide(notification.ride);
                    }
                },
                onError: function(error) {
                    alert(error);
                },
                senderID: "924493480566",
                permissions: {
                    alert: true,
                    badge: true,
                    sound: true
                },
                popInitialNotification: false,
                requestPermissions: true
            });
        }
    },

    componentDidMount: function () {
        PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

        BackAndroid.addEventListener('hardwareBackPress', this.goBack);

        CurrentRideStore.on(events.currentRideLoaded, this.currentRideLoaded);

        CurrentUserStore.on(events.currentUserLoaded, this.currentUserLoaded);

        CurrentUserStore.on(events.gcmTokenLoaded, (gcmToken) => {
            var currentUser = this.state.currentUser;
            currentUser.gcm_token = gcmToken;
            this.setState({currentUser: currentUser});
            updateCurrentUser(currentUser);
        });

        CurrentUserStore.on(events.userLoggedOut, (error) => {
            this.setState({currentUser: {}});
            this.goToPage('LoginPage');
        });
    },

    customerDrawerView: function () {
        return (
            <View>
                <View style={{padding:10}}>
                    <Avatar image={this.state.currentUser.avatar}/>
                </View>
                <View style={{padding:10}}>
                    <Text>
                        {this.state.currentUser.first_name} {this.state.currentUser.last_name}
                    </Text>
                </View>

                <View style={{backgroundColor: '#555555', padding: 8}}>
                    <Link
                        style={{padding: 8}}
                        action={() => this.goToPage('CurrentLocationPage')}
                        size={14}
                        color={'#DDDDDD'}
                        icon={'motorcycle'}
                        text={'New Ride'}
                    />
                    <Link
                        style={{padding: 8}}
                        action={() => this.goToPage('ProfilePage')}
                        size={14}
                        color={'#DDDDDD'}
                        icon={'account-circle'}
                        text={'My Profile'}
                    />
                    <IconText
                        style={{padding: 8}}
                        size={14}
                        color={'#666666'}
                        icon={'favorite'}
                        text={'My Favourite Drivers'}
                    />
                    <IconText
                        style={{padding: 8}}
                        size={14}
                        color={'#666666'}
                        icon={'history'}
                        text={'My Ride History'}
                    />
                    <IconText
                        style={{padding: 8}}
                        size={14}
                        color={'#666666'}
                        icon={'people'}
                        text={'Invite Friends'}
                    />
                    <Link
                        action={() => this.goToPage('TermsPage')}
                        style={{padding: 8}}
                        size={14}
                        color={'#DDDDDD'}
                        icon={'assignment'}
                        text={'Terms'}
                    />
                    <Link
                        action={this.logout}
                        style={{padding: 8}}
                        size={14}
                        color={'#DDDDDD'}
                        icon={'power-settings-new'}
                        text={'Logout'}
                    />

                </View>

            </View>
        );
    },

    driverDrawerView: function () {
        return (
            <View>
                <View style={{padding:10}}>
                    <Avatar image={this.state.currentUser.avatar}/>
                </View>
                <View style={{padding:10}}>
                    <Text>
                        {this.state.currentUser.first_name} {this.state.currentUser.last_name}
                    </Text>
                </View>
                <View style={{backgroundColor: '#555555', padding: 8}}>
                    <Link
                        style={{padding: 8}}
                        action={() => this.goToPage('DriverHomePage')}
                        size={14}
                        color={'#DDDDDD'}
                        icon={'motorcycle'}
                        text={'Home'}
                    />
                    <Link
                        style={{padding: 8}}
                        action={() => this.goToPage('ProfilePage')}
                        size={14}
                        color={'#DDDDDD'}
                        icon={'account-circle'}
                        text={'My Profile'}
                    />
                    <IconText
                        style={{padding: 8}}
                        size={14}
                        color={'#666666'}
                        icon={'history'}
                        text={'My Ride History'}
                    />
                    <IconText
                        style={{padding: 8}}
                        size={14}
                        color={'#666666'}
                        icon={'people'}
                        text={'Invite Friends'}
                    />
                    <Link
                        action={() => this.goToPage('TermsPage')}
                        style={{padding: 8}}
                        size={14}
                        color={'#DDDDDD'}
                        icon={'assignment'}
                        text={'Terms'}
                    />
                    <Link
                        action={this.logout}
                        style={{padding: 8}}
                        size={14}
                        color={'#DDDDDD'}
                        icon={'power-settings-new'}
                        text={'Logout'}
                    />

                </View>

            </View>
        );
    },
    anonymousDrawerView: function () {
        return (
            <View>
                <View style={{backgroundColor: '#555555', padding: 8}}>
                    <IconText
                        style={{padding: 8}}
                        size={14}
                        color={'#666666'}
                        icon={'people'}
                        text={'About Twende'}
                    />
                    <Link
                        action={() => this.goToPage('TermsPage')}
                        style={{padding: 8}}
                        size={14}
                        color={'#DDDDDD'}
                        icon={'assignment'}
                        text={'Terms'}
                    />
                    <Link
                        action={() => this.goToPage('LoginPage')}
                        style={{padding: 8}}
                        size={14}
                        color={'#DDDDDD'}
                        icon={'power-settings-new'}
                        text={'Log in'}
                    />
                </View>
            </View>
        );
    },

    render: function (route, navigator) {
        var drawer = this.anonymousDrawerView;
        if (this.state.currentUser.is_driver) {
            drawer = this.driverDrawerView;
        } else if (this.state.currentUser.username) {
            drawer = this.customerDrawerView;
        }
        return (
            <DrawerLayoutAndroid
                drawerWidth={200}
                ref={'DRAWER'}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={drawer}>
                <Navigator
                    initialRoute={{id: 'SplashPage', name: 'Splash'}}
                    renderScene={this.renderScene}
                    drawer={this.refs['DRAWER']}
                    navigator={navigator}
                    goToPage={this.goToPage}
                    goBack={this.goBack}
                    state={this.state}
                    configureScene={(route) => {
                  return Navigator.SceneConfigs.FadeAndroid;
                }}
                />
            <StatusBar
                 backgroundColor={colors.primary_dark}
                 barStyle="dark-content"
               />
            </DrawerLayoutAndroid>
        );
    },

    renderScene: function (route, navigator) {
        var routeId = route.id;
        this.navigator = navigator;
        if (routeId === 'SplashPage') {
            return (
                <SplashPage
                    goToPage={this.goToPage}
                    navigator={navigator}/>
            );
        }
        if (routeId === 'LoginPage') {
            return (
                <LoginPage
                    goToPage={this.goToPage}
                    navigator={navigator}/>
            );
        }
        if (routeId === 'TermsPage') {
            return (
                <TermsPage
                    goToPage={this.goToPage}
                    navigator={navigator}/>
            );
        }
        if (routeId === 'ProfilePage') {
            return (
                <ProfilePage
                    openDrawer={this.openDrawer}
                    goToPage={this.goToPage}
                    state={this.state}
                    currentUser={this.state.currentUser}
                    navigator={navigator}/>
            );
        }
        if (routeId === 'DriverHomePage') {
            return (
                <DriverHomePage
                    openDrawer={this.openDrawer}
                    goToPage={this.goToPage}
                    currentUser={this.state.currentUser}
                    navigator={navigator}/>
            );
        }
        if (routeId === 'RequestRidePage') {
            return (
                <RequestRidePage
                    openDrawer={this.openDrawer}
                    goToPage={this.goToPage}
                    currentUser={this.state.currentUser}
                    navigator={navigator}
                    driver={route.driver}/>
            );
        }
        if (routeId === 'CurrentLocationPage') {
            return (
                <CurrentLocationPage
                    openDrawer={this.openDrawer}
                    goToPage={this.goToPage}
                    currentUser={this.state.currentUser}
                    currentRide={this.state.currentRide}
                    navigator={navigator}
                    driver={route.driver}/>
            );
        }
        if (routeId === 'CurrentRidePage') {
            return (
                <CurrentRidePage
                    openDrawer={this.openDrawer}
                    goToPage={this.goToPage}
                    currentRide={route.currentRide}
                    currentUser={this.state.currentUser}
                    navigator={navigator}
                    driver={route.driver}/>
            );
        }
        if (routeId === 'DriverListPage') {
            return (
                <DriverListPage
                    openDrawer={this.openDrawer}
                    goToPage={this.goToPage}
                    currentRide={route.currentRide}
                    currentUser={this.state.currentUser}
                    navigator={navigator}/>
            );
        }
        return this.noRoute(navigator);

    },

    noRoute: function (navigator) {
        return (
            <View>
                <TouchableOpacity onPress={() => navigator.pop()}>
                    <Text>
                        Unknown route...
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
});

module.exports = TwendeApp;


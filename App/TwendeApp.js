/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
    Image,
    Text,
    View,
    Navigator,
    ToastAndroid,
    TouchableOpacity,
    DrawerLayoutAndroid,
    BackAndroid,
    TouchableHighlight,
    DeviceEventEmitter
    } = React;

var SplashPage = require('./Pages/SplashPage');
var LoginPage = require('./Pages/LoginPage');
var ProfilePage = require('./Pages/ProfilePage');
var RequestRidePage = require('./Pages/RequestRidePage');
var CurrentRidePage = require('./Pages/CurrentRidePage');
var CurrentLocationPage = require('./Pages/CurrentLocationPage');
var DriverListPage = require('./Pages/DriverListPage');
var DriverHomePage = require('./Pages/DriverHomePage');
var NoNavigatorPage = require('./Pages/NoNavigatorPage');

var Drawer = require('./Components/Drawer');
var Avatar = require('./Components/Avatar');
var IconText = require('./Components/IconText');
var Link = require('./Components/Link');
import { colors, styles } from "./Styles";
import events from "./Constants/Events";
import CurrentUserStore from './Stores/CurrentUserStore';
import CurrentRideStore from './Stores/CurrentRideStore';
import {
    logoutCurrentUser,
    setGcmToken,
    updateCurrentUser } from './Actions/CurrentUserActions';
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
        },

        goToPage: function (pageId) {
            this.closeDrawer();
            this.navigator.replace({id: pageId});
        },

        goBack: function () {
            this.navigator.pop();
        },


        registerPushNotification: function () {
            PushNotification.configure({
                onRegister: function (token) {
                    ToastAndroid.show('Checking messages...', ToastAndroid.SHORT)
                    setGcmToken(token.token);
                },
                onNotification: function (notification) {
                    ToastAndroid.show('Got message...', ToastAndroid.SHORT)
                    if (notification.title) {
                        notify(notification.title, notification.message);
                    }
                    if (notification.ride) {
                        refreshCurrentRide(notification.ride);
                    }
                },
                onError: function(error) {
                    console.log(error);
                },
                senderID: "1055251321691",
                permissions: {
                    alert: true,
                    badge: true,
                    sound: true
                }
            });
        },

        componentWillMount: function () {
            CurrentRideStore.on(events.currentRideLoaded, (currentRide) => {
                this.setState({currentRide: currentRide});
                if (this.state.currentUser.is_driver) {
                    this.navigator.push({
                        id: 'DriverHomePage',
                        currentUser: currentUser,
                        currentRide: currentRide
                    });

                } else {
                    if (currentRide.state != 'new') {
                        this.navigator.push({
                            id: 'CurrentRidePage',
                            driver: currentRide.driver,
                            currentUser: this.state.currentUser,
                            currentRide: currentRide
                        });
                    }
                }

            });

            CurrentUserStore.on(events.gcmTokenLoaded, (gcmToken) => {
                var currentUser = this.state.currentUser;
                currentUser.gcm_token = gcmToken;
                this.setState({currentUser: currentUser});
                updateCurrentUser(currentUser);
            });

            BackAndroid.addEventListener('hardwareBackPress', this.goBack);

            CurrentUserStore.on(events.currentUserLoaded, (currentUser) => {
                this.setState({currentUser: currentUser});
                this.registerPushNotification();
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
                    <View style={{backgroundColor: '#555555', padding: 8, flex: 1}}>
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
                    <View style={{backgroundColor: '#555555', padding: 8, flex: 1}}>
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
                    <View style={{backgroundColor: '#555555', padding: 8, flex: 1}}>
                        <IconText
                            style={{padding: 8}}
                            size={14}
                            color={'#666666'}
                            icon={'people'}
                            text={'About Twende'}
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
                        goToPage={this.goToPage}
                        state={this.state}
                        configureScene={(route) => {
                      return Navigator.SceneConfigs.FadeAndroid;
                    }}
                    />
                </DrawerLayoutAndroid>
            );
        }
        ,


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

        }
        ,

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
    })
    ;

module.exports = TwendeApp;


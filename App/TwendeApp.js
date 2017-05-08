/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Alert,
    Text,
    NetInfo,
    View,
    Image,
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
var CurrentRidePage = require('./Pages/CurrentRidePage');
var CurrentLocationPage = require('./Pages/CurrentLocationPage');
var DriverListPage = require('./Pages/DriverListPage');
var DriverHomePage = require('./Pages/DriverHomePage');
var NoNavigatorPage = require('./Pages/NoNavigatorPage');
var TermsPage = require('./Pages/TermsPage');
var CustomerSupportPage = require('./Pages/CustomerSupportPage');
var FarePricePage = require('./Pages/FarePricePage');

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
    reloadCurrentUser,
    logoutCurrentUser,
    setGcmToken,
    updateCurrentUser } from './Actions/CurrentUserActions';
import { logoutFacebookUser }  from './Actions/SocialActions';
var PushNotification = require('react-native-push-notification');
import { notify } from "./Actions/NotifyActions"
import {
    refreshCurrentRide,
    loadRideList } from "./Actions/CurrentRideActions";



var TwendeApp = React.createClass({

    getInitialState: function (props) {
        return {
            currentUser: {},
            currentRide: {},
            isConnected: null
        };
    },

    closeApp: function() {
        let user = this.state.currentUser;
        if (user.is_driver){
            Alert.alert(
                "Are you leaving?",
                "Do you want to close Twende? You won't receive customer requests anymore.",
                [
                    {
                        text: "No, I'm staying",
                        onPress: () => {return true}
                    },
                    {   text: "Yes, close",
                        onPress: () => {
                            user.state = 'unvailable';
                            updateCurrentUser(user);
                            this.logout();
                            ToastAndroid.show("Goodbye, kuona hivi karibuni", ToastAndroid.LONG);
                            BackAndroid.exitApp();
                        }
                    }
                ]
            );

        } else {
            Alert.alert(
                "Are you leaving?",
                "Are you sure you want to close Twende?.",
                [
                    {
                        text: "No, I'm staying",
                        onPress: () => {return true}
                    },
                    {
                        text: "Yes, close",
                        onPress: () => {
                            this.logout()
                            ToastAndroid.show("Goodbye, kuona hivi karibuni!", ToastAndroid.LONG);
                            BackAndroid.exitApp();
                        }
                    }
                ]
            );

        }
        return true;

    },

    backButton: function() {
        var navigator = this.navigator
        if (navigator.getCurrentRoutes().length > 2) {
            navigator.pop();
            return true;
        } else {
            return this.closeApp();
        }

    },

    componentWillMount: function () {
        PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        BackAndroid.addEventListener("hardwareBackPress", this.backButton);
        CurrentRideStore.on(events.currentRideLoaded, this.currentRideLoaded);
        CurrentRideStore.on(events.noCurrentRide, this.noCurrentRide);
        CurrentUserStore.on(events.currentUserLoaded, this.currentUserLoaded);
        CurrentUserStore.on(events.noCurrentUser, this.goToLogin);
        CurrentUserStore.on(events.userLoggedOut, this.goToLogin);
        CurrentUserStore.on(events.gcmTokenLoaded, this.setGcmToken);
        NetInfo.isConnected.addEventListener('change', this.handleConnectivityChange );
        NetInfo.isConnected.fetch().done( (isConnected) => { this.setState({isConnected}); } );
        reloadCurrentUser()
    },

    componentWillUnmount: function() {
        NetInfo.isConnected.removeEventListener( 'change', this.handleConnectivityChange );
    },

    componentDidMount() {
        NetInfo.isConnected.addEventListener( 'change', this.handleConnectivityChange );
        NetInfo.isConnected.fetch().done( (isConnected) => { this.setState({isConnected}); } );
    },

    handleConnectivityChange: function (isConnected) {
        this.setState({ 
        isConnected, 
        }); 
    },

    currentUserLoaded: function(currentUser) {
        if (currentUser && this.state.currentUser.username !== currentUser.username) {
            this.setState({currentUser: currentUser});
            this.registerPushNotification();
            loadRideList();
            if (currentUser.is_driver) {
                this.goHome()
            }
        }
        this.setState({currentUser: currentUser});
    },

    openDrawer: function () {
        this.refs['DRAWER'].openDrawer()
    },
    closeDrawer: function () {
        if (this.refs['DRAWER']) {
            this.refs['DRAWER'].closeDrawer()
        }
    },

    logout: function () {
        this.closeDrawer();
        logoutCurrentUser();
        logoutFacebookUser();
    },

    goToPage: function (pageId) {
        this.closeDrawer();
        this.navigator.push({
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
                currentUser: this.state.currentUser,
                currentRide: this.state.currentRide
            });
        } else {
            this.navigator.push({
                id: 'CurrentLocationPage',
                currentUser: this.state.currentUser,
                currentRide: this.state.currentRide
            });
        }
    },

    noCurrentRide: function() {
        var currentRoute = this.navigator.getCurrentRoutes().pop().id;
        if (this.state.currentUser.is_driver) {
            if (currentRoute !== 'DriverHomePage') {
                this.navigator.push({
                    id: 'DriverHomePage',
                    currentUser: this.state.currentUser,
                    currentRide: {}
                });
            }
        } else {
            if (currentRoute !== 'CurrentLocationPage') {
                this.navigator.push({
                    id: 'CurrentLocationPage',
                    currentUser: this.state.currentUser
                });
            }
        }
    },

    refreshRide: function () {
        refreshCurrentRide(this.props.currentRide.id);
        ToastAndroid.show('Updating App State..', ToastAndroid.SHORT)
    },

    currentRideLoaded: function(currentRide) {
        this.setState({currentRide: currentRide});

        if (this.state.currentUser.is_driver) {
            if (currentRide.state == 'requested') {
                sounds.alarm2.play();
            }
            if (currentRide.state == 'canceled') {
                this.state.currentUser.state = 'unavailable';
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
            } else if (['requested', 'accepted', 'driving', 'dropoff', 'payment'].indexOf(currentRide.state) > -1) {
                this.navigator.push({
                    id: 'CurrentRidePage',
                    currentUser: this.state.currentUser,
                    currentRide: currentRide
                });
            } else if (currentRide.state == 'finalized' && !currentRide.customer_rating) {
                this.navigator.push({
                    id: 'CurrentRidePage',
                    currentUser: this.state.currentUser,
                    currentRide: currentRide
                });
            } else {
                this.navigator.push({
                    id: 'CurrentLocationPage',
                    currentUser: this.state.currentUser
                });
            }
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
                        window.setTimeout(loadRideList, 800);
                        // loadRideList();
                        // Some how loading specific ride here gives a 404
                        // refreshCurrentRide(notification.ride);
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

    goToLogin: function() {
        this.setState({currentUser: {}});
        this.goToPage('LoginPage');
    },

    setGcmToken: function(gcmToken) {
        var currentUser = this.state.currentUser;
        currentUser.gcm_token = gcmToken;
        this.setState({currentUser: currentUser});
        updateCurrentUser(currentUser);
    },

    customerDrawerView: function () {
        return (
            <View>
                <View style={styles.menu_head}>
                    <Image
                        source={require('./assets/banner_drawer.jpg')}
                        style={styles.menu_background}
                        />
                    <Link
                        style={styles.menu_close}
                        action={this.closeDrawer}
                        iconSize={20}
                        icon={'close'}
                    />
                    <View style={styles.menu_title}>
                        <Avatar image={this.state.currentUser.avatar}/>
                        <Text>
                            {this.state.currentUser.first_name} {this.state.currentUser.last_name}
                        </Text>
                    </View>

                </View>
                <View style={styles.menu_list}>
                    <Link
                        action={() => this.goToPage('CustomerSupportPage')}
                        style={{padding: 8}}
                        size={15}
                        color={'#FFFFFF'}
                        icon={'phone'}
                        text={'Customer Support'}
                    />
                    <Link
                        style={{padding: 8}}
                        action={() => this.goToPage('ProfilePage')}
                        size={15}
                        color={'#FFFFFF'}
                        icon={'account-circle'}
                        text={'My Profile'}
                    />
                    <Link
                        action={() => this.goToPage('TermsPage')}
                        style={{padding: 8}}
                        size={15}
                        color={'#FFFFFF'}
                        icon={'assignment'}
                        text={'Terms'}
                    />
                    <Link
                        action={this.logout}
                        style={{padding: 8}}
                        size={15}
                        color={'#FFFFFF'}
                        icon={'lock-open'}
                        text={'Logout'}
                    />
                    <Link
                        action={this.closeApp}
                        style={{padding: 8}}
                        size={15}
                        color={'#FFFFFF'}
                        icon={'power-settings-new'}
                        text={'Close Twende'}
                    />

                </View>

            </View>
        );
    },

    driverDrawerView: function () {
        return (
            <View>
                <View style={styles.menu_head}>

                    <Image
                        source={require('./assets/banner_drawer.jpg')}
                        style={styles.menu_background}
                        />
                    <Link
                        style={styles.menu_close}
                        action={this.closeDrawer}
                        iconSize={20}
                        icon={'close'}
                    />
                    <View style={styles.menu_title}>
                        <Avatar image={this.state.currentUser.avatar}/>
                        <Text>
                            {this.state.currentUser.first_name} {this.state.currentUser.last_name}
                        </Text>
                    </View>
                </View>
                <View style={styles.menu_list}>
                    <Link
                        style={{padding: 8}}
                        action={() => this.goToPage('DriverHomePage')}
                        size={14}
                        color={'#FFFFFF'}
                        icon={'motorcycle'}
                        text={'Home'}
                    />
                    <Link
                        action={() => this.goToPage('CustomerSupportPage')}
                        style={{padding: 8}}
                        size={14}
                        color={'#FFFFFF'}
                        icon={'phone'}
                        text={'Customer support'}
                    />
                    <Link
                        style={{padding: 8}}
                        action={() => this.goToPage('ProfilePage')}
                        size={14}
                        color={'#FFFFFF'}
                        icon={'account-circle'}
                        text={'My Profile'}
                    />
                    <Link
                        style={{padding: 8}}
                        size={14}
                        color={'#666666'}
                        icon={'history'}
                        text={'My Ride History'}
                    />
                    <Link
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
                        color={'#FFFFFF'}
                        icon={'assignment'}
                        text={'Terms'}
                    />
                    <Link
                        action={this.logout}
                        style={{padding: 8}}
                        size={14}
                        color={'#FFFFFF'}
                        icon={'lock-open'}
                        text={'Logout'}
                    />
                    <Link
                        action={this.closeApp}
                        style={{padding: 8}}
                        size={14}
                        color={'#FFFFFF'}
                        icon={'power-settings-new'}
                        text={'Close Twende'}
                    />
                </View>
            </View>
        );
    },

    anonymousDrawerView: function () {
        return (
            <View>
                <View style={styles.menu_head}>
                    <Image
                        source={require('./assets/banner_drawer.jpg')}
                        style={styles.menu_background}
                        />
                    <Link
                        style={styles.menu_close}
                        action={this.closeDrawer}
                        iconSize={20}
                        icon={'close'}
                    />
                </View>
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
                        color={'#FFFFFF'}
                        icon={'assignment'}
                        text={'Terms'}
                    />
                    <Link
                        action={() => this.goToPage('LoginPage')}
                        style={{padding: 8}}
                        size={14}
                        color={'#FFFFFF'}
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


        if (this.state.isConnected == false) {
            this.handleRequestCallback;
        }

        
        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
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
                    currentUser={this.state.currentUser}
                    navigator={navigator}/>
            );
        }
        if (routeId === 'LoginPage') {
            return (
                <LoginPage
                    goToPage={this.goToPage}
                    currentUser={this.state.currentUser}
                    navigator={navigator}/>
            );
        }

        if (routeId === 'CustomerSupportPage') {
            return (
                <CustomerSupportPage
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
                    currentRide={this.state.currentRide}
                    navigator={navigator}/>
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
                    currentRide={this.state.currentRide}
                    currentUser={this.state.currentUser}
                    navigator={navigator}
                    driver={this.state.driver}/>
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
        if (routeId === 'FarePricePage') {
            return (
                <FarePricePage
                    openDrawer={this.openDrawer}
                    goToPage={this.goToPage}
                    currentRide={route.currentRide}
                    currentUser={this.state.currentUser}
                    navigator={navigator}/>
            );
        }
        return this.noRoute(navigator);
             Alert.alert(
            'Unable to log in',
            'Check your internet connection',
            [
                {text: 'OKAY!'}
            ]
        );
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


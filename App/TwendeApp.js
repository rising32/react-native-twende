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
var DriverRidePage = require('./Pages/DriverRidePage');
var NoNavigatorPage = require('./Pages/NoNavigatorPage');
var TermsPage = require('./Pages/TermsPage');
var FarePricePage = require('./Pages/FarePricePage');
var CustomerSupportPage = require('./Pages/CustomerSupportPage');

var Drawer = require('./Components/Drawer');
var Avatar = require('./Components/Avatar');
var IconText = require('./Components/IconText');
var Link = require('./Components/Link');
import { colors, styles } from "./Styles";
import { sounds } from "./Sounds";
import {sendError} from "./Actions/ErrorLogActions";
import events from "./Constants/Events";
import CurrentUserStore from './Stores/CurrentUserStore';
import CurrentRideStore from './Stores/CurrentRideStore';
import { createCurrentRide } from './Actions/CurrentRideActions';
import {
    reloadCurrentUser,
    logoutCurrentUser,
    setGcmToken,
    updateCurrentUser } from './Actions/CurrentUserActions';
import { logoutFacebookUser }  from './Actions/SocialActions';
var PushNotification = require('react-native-push-notification');
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
        var navigator = this.navigator;
        if (navigator.getCurrentRoutes().length > 2) {
            navigator.pop();
            return true;
        } else {
            return this.closeApp();
        }

    },

    componentWillMount: function () {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
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
        let user = this.state.currentUser;
        if (user.is_driver) {
            user.state = 'unvailable';
            updateCurrentUser(user);
        }
        logoutCurrentUser();
        logoutFacebookUser();
    },

    goToPage: function (pageId) {
        this.closeDrawer();
        try {
            this.navigator.push({
                id: pageId,
                currentUser: this.state.currentUser,
                currentRide: this.state.currentRide
            });
        } catch (err) {
            sendError("ERROR", err, null, this.state.currentRide.id);
            ToastAndroid.show("Something went wrong. Please reload the app", ToastAndroid.LONG)
        }
    },

    replacePage: function (pageId) {
        this.closeDrawer();
        try {
            this.navigator.replace({
                id: pageId,
                currentUser: this.state.currentUser,
                currentRide: this.state.currentRide
            });
        } catch (err) {
            sendError("ERROR", err, null, this.state.currentRide.id);
            ToastAndroid.show("Something went wrong. Please reload the app", ToastAndroid.LONG)
        }
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
        const currentRoute = this.navigator.getCurrentRoutes().pop().id;
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
        const previous = this.state.currentRide;
        const currentUser = this.state.currentUser;
        if (previous.id === currentRide.id
                && currentRide.state !== 'finalized'
                && previous.state === currentRide.state
                && previous.driver.username === currentRide.driver.username) {
            // Nothing much changed. Just update state and return.
            this.setState({currentRide: currentRide});
            return;
        }
        this.setState({currentRide: currentRide});
        if (currentUser.is_driver) {
            if (currentRide.state === 'requested') {
                this.replacePage('DriverRidePage');
            } else if (['accepted', 'driving', 'dropoff', 'payment'].indexOf(currentRide.state) > -1) {
                this.state.currentUser.state = 'unavailable';
                this.replacePage('DriverRidePage');
            } else if (currentRide.state === 'finalized') {
                if (currentRide.driver_rating > 0 ) {
                    // Ride finalized and rated: Go home
                    this.replacePage('DriverHomePage');
                } else {
                    // Ride finalized but still needs rider rate
                    this.replacePage('DriverRidePage');
                }
            } else {
                if (currentRide.state === 'canceled') {
                    currentUser.state = 'available';
                    this.setState('currentUser', currentUser);
                }
                this.replacePage('DriverHomePage');
            }
        } else {
            if (currentRide.state === 'canceled') {
                // Create a new ride so you end up at driver list.
                let ride = {
                    origin: currentRide.origin,
                    origin_text: currentRide.origin_text
                };
                createCurrentRide(ride);
            } else if (currentRide.state === 'new') {
                this.replacePage('DriverListPage');
            } else if (['requested', 'accepted', 'driving', 'dropoff', 'payment'].indexOf(currentRide.state) > -1) {
                this.replacePage('CurrentRidePage');
            } else if (currentRide.state === 'finalized' && !currentRide.customer_rating) {
                this.replacePage('CurrentRidePage');
            } else {
                this.replacePage('CurrentLocationPage');
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
                        let sound = 'default';
                        if (notification.sound === 'jingle') {
                            sound = 'alarm2.mp3';
                        }
                        PushNotification.localNotification({
                            title: notification.title,
                            message: notification.message,
                            soundName: sound
                        });
                    }
                    if (notification.ride) {
                        window.setTimeout(loadRideList, 800);
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
                        style={{padding: 8}}
                        action={() => this.goToPage('ProfilePage')}
                        size={15}
                        color={'#FFFFFF'}
                        icon={'account-circle'}
                        text={'My Profile'}
                    />
                    <Link
                        action={() => this.goToPage('CustomerSupportPage')}
                        style={{padding: 8}}
                        size={15}
                        color={'#FFFFFF'}
                        icon={'phone'}
                        text={'Customer Support'}
                    />
                    <Link
                        action={() => this.goToPage('TermsPage')}
                        style={{padding: 8}}
                        size={15}
                        color={'#FFFFFF'}
                        icon={'library-books'}
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
                        action={() => this.goToPage('ProfilePage')}
                        size={14}
                        color={'#FFFFFF'}
                        icon={'account-circle'}
                        text={'My Profile'}
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
                        icon={'library-books'}
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
        if (routeId === 'FarePricePage') {
            return (
                <FarePricePage
                    currentUser={this.state.currentUser}
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
        if (routeId === 'DriverRidePage') {
            return (
                <DriverRidePage
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


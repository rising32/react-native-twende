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
    TouchableOpacity,
    DrawerLayoutAndroid,
    TouchableHighlight,
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

var CurrentUserAction = require('./Actions/CurrentUserAction');
var CurrentUserStore = require('./Stores/CurrentUserStore');

var Drawer = require('./Components/Drawer');
var Avatar = require('./Components/Avatar');
var IconText = require('./Components/IconText');
var Link = require('./Components/Link');
import {colors, styles} from "./Styles";

var TwendeApp = React.createClass({

        openDrawer: function () {
            this.refs['DRAWER'].openDrawer()
        },
        closeDrawer: function () {
            this.refs['DRAWER'].closeDrawer()
        },

        logout: function () {
            CurrentUserAction.logout();
            this.closeDrawer();
            this.navigator.replace({id: 'LoginPage'});
        },

        goToPage: function(pageId) {
            this.closeDrawer();
            if (pageId == 'HomePage') {
                var homePage = this.state.homePage;
                this.navigator.replace({id: homePage});
            } else {
                this.navigator.replace({id: pageId});
            }
        },

        getInitialState: function (props) {
            return {
                loading: true,
                loggedIn: false,
                homePage: 'CurrentLocationPage',
                currentUser: {}
            };
        },

        componentDidMount: function () {
            var navigator = this.props.navigator;
            CurrentUserStore.addListener((currentUser) => {
                if (currentUser) {
                    this.setState({currentUser: currentUser});
                    if (currrentUser.is_driver) {
                        this.setState({homePage: 'DriverHomePage'});
                    }
                }
            });
        },

        drawerView: function () {
            return (
                <View>
                    <View style={{padding:10}}>
                        <Avatar image={this.state.currentUser.avatar}/>
                    </View>
                    <View style={{padding:10}}>
                        <Text>
                            {this.state.currentUser.name}
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

        render: function (route, navigator) {

            return (
                <DrawerLayoutAndroid
                    drawerWidth={200}
                    ref={'DRAWER'}
                    drawerPosition={DrawerLayoutAndroid.positions.Left}
                    renderNavigationView={this.drawerView}>
                    <Navigator
                        initialRoute={{id: 'SplashPage', name: 'Index'}}
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
    })
    ;

module.exports = TwendeApp;

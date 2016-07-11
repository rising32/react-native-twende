'use strict';

var React = require('react-native');

var {
    View,
    Text,
    ToastAndroid,
    TextInput,
    Navigator,
    TouchableHighlight,
    } = React;

import {colors, styles} from "../Styles";
var IconText = require('../Components/IconText');
const FBSDK = require('react-native-fbsdk');
const {
    LoginButton
    } = FBSDK;
import events from "../Constants/Events";
var Link = require('../Components/Link');
import Dispatcher from "../Dispatcher";
import CurrentUserStore from '../Stores/CurrentUserStore';
import { loginCurrentUser }  from '../Actions/CurrentUserActions';
import { loadFacebookUser }  from '../Actions/SocialActions';


var LoginPage = React.createClass({

    getInitialState: function () {
        return {
            error: false,
            loading: false,
            currentUser: {},
            username: '',
            password: ''
        };
    },

    componentWillMount: function () {
        CurrentUserStore.on(events.loginFailed, this.setLoginError);
        CurrentUserStore.on(events.currentUserLoaded, this.goToHome);
    },

    componentWillUnmount: function () {
        CurrentUserStore.removeListener(events.loginFailed, this.setLoginError);
        CurrentUserStore.removeListener(events.currentUserLoaded, this.goToHome);
    },

    setLoginError: function () {
        this.setState({
            currentUser: {},
            error: true
        });
    },

    goToHome: function (currentUser) {
        ToastAndroid.show(`Logged in as ${currentUser.first_name}.`, ToastAndroid.SHORT);
        if (currentUser.is_driver) {
            this.props.navigator.replace({id: 'DriverHomePage', currentUser: currentUser});
        } else {
            this.props.navigator.replace({id: 'CurrentLocationPage', currentUser: currentUser});
        }
    },

    login: function () {
        this.setState({
            loading: true,
            error: false
        });

        loginCurrentUser(
            this.state.username,
            this.state.password
        );
    },

    render: function () {
        return (
            <Navigator
                renderScene={this.renderScene}
                navigationBar={
            <Navigator.NavigationBar style={styles.nav_bar}
                routeMapper={NavigationBarRouteMapper} />
          }/>
        );
    },


    renderSocialLogin: function () {
        var fbToken;
        return (
            <LoginButton
                readPermissions={["email"]}
                onLoginFinished={
                    (error, result) => {
                        if (error) {
                            alert("Login has error: " + result.error);
                        } else if (result.isCancelled) {
                            alert("Login is cancelled.");
                        } else {
                            if (!fbToken) {
                                fbToken = result;
                                loadFacebookUser();
                            }
                        }
                    }
                }
                onLogoutFinished={() => {
                    fbToken = null;
                }}/>

        )
    },

    renderUsernameLogin: function () {
        return (
            <View>
                <TextInput
                    scrollRef={"username"}
                    placeholder={"Username"}
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({username: text})}
                    style={styles.text_input}
                    value={this.state.username}
                />
                <TextInput
                    placeholder={"Password"}
                    returnKeyType={'go'}
                    secureTextEntry={true}
                    onChangeText={(text) => this.setState({password: text})}
                    style={styles.text_input}
                    value={this.state.password}
                    onSubmitEditing={() => this.login()}
                />
                <TouchableHighlight
                    smartScrollOptions={{
                        type: 'text'
                    }}
                    style={styles.primary_button}
                    onPress={this.login}
                >
                    <Text style={styles.primary_button_text}>LOGIN</Text>
                </TouchableHighlight>
            </View>
        )
    },

    renderScene: function (route, navigator) {
        var error = this.state.error ?
            <IconText color={colors.error} icon={"error"} text={"Error logging in"}/> : null;

        var content = this.renderSocialLogin();


        return (
            <View style={[styles.page, styles.page_full, styles.card]}>

                <View style={[styles.page, styles.page_full, styles.card]}>
                    {error}
                    {content}
                </View>
                <Text>
                    By signing up you agree to Twende's
                </Text>
                <Link
                    action={() => this.props.navigator.push({id: 'TermsPage'})}
                    text={'Terms of Service'}
                    color={colors.action}
                />
            </View>
        );
    }
});

var NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, navState) {
        return null;
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

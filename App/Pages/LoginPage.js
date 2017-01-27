'use strict';

var React = require('react');
var ReactNative = require('react-native');

var {
    Alert,
    View,
    Text,
    ToastAndroid,
    TextInput,
    Navigator,
    TouchableHighlight,
    } = ReactNative;

import {colors, styles} from "../Styles";
var IconText = require('../Components/IconText');
const FacebookLogin = require('react-native-facebook-login');
var { FBLogin, FBLoginManager } = FacebookLogin;
import events from "../Constants/Events";
var Link = require('../Components/Link');
import Dispatcher from "../Dispatcher";
import CurrentUserStore from '../Stores/CurrentUserStore';
import { loginCurrentUser }  from '../Actions/CurrentUserActions';
import { loadFacebookUser, reloadFacebookUser }  from '../Actions/SocialActions';



var LoginPage = React.createClass({

    getInitialState: function () {
        return {
            error: false,
            loading: false,
            currentUser: {},
            username: '',
            password: '',
            ready: false
        };
    },

    componentWillMount: function () {
        CurrentUserStore.on(events.loginFailed, this.setLoginError);
    },

    removeListeners: function () {
        CurrentUserStore.removeListener(events.loginFailed, this.setLoginError);
    },

    componentWillUnmount: function () {
        this.removeListeners();
    },

    setLoginError: function () {
        this.setState({
            currentUser: {},
            error: true
        });
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
            <FBLogin
                style={{flex: 0}}
                permissions={["email"]}
                loginBehavior={FBLoginManager.LoginBehaviors.Native}
                onLogin={
                    (data) => {
                        this.setState({ready: true});
                        loadFacebookUser(data);
                    }
                }
                onLogout={() => {
                  console.log("Logged out.");
                  this.setState({ user : null });
                }}
                onLoginFound={(data) => {
                    this.setState({ready: true});
                    loadFacebookUser(data);
                }}
                onLoginNotFound={() => {
                  console.log("No user logged in.");
                  this.setState({ user : null });
                }}
                onError={(data) =>{
                  console.log("ERROR");
                  console.log(data);
                }}
                onCancel={() => {
                  console.log("User cancelled.");
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

        var spinner;
        if (this.state.ready) {
            spinner = (
                <View style={styles.spinner}>
                    <Text>Login successful...</Text>
                </View>
            );
        }

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
                {spinner}
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

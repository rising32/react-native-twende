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
    Image
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
                    <Text style={styles.spinner_text}>Logging in! Please stand by..</Text>
                </View>
            );
        }

        var content = this.renderSocialLogin();


        return (
            <View style={styles.loginPage}>
                <View style={{flex: 0.15}}>
                </View>
                <View style={{flex: 0.15}}>
                {spinner}
                </View>
                <View style={{flex: 0.2, marginTop: 20, justifyContent: 'flex-end'}}>
                        <Image
                          style={{width: 105, height: 105}}
                          source={require('../assets/logo.png')}/>
                </View>
                <View style={{flex: 0.2, justifyContent: 'flex-end'}}>
                    <Text style={[styles.item_title, {textAlign: 'center', color: colors.secondary, fontSize: 30}]}>
                        Karibu!
                    </Text>
                </View>
                 <View style={{flex: 0.1, marginTop: 20, justifyContent: 'center'}}>
                    <View>
                        <Image
                          style={{width: 50, height: 33}}
                          source={require('../assets/flagkenya.png')}/>
                    </View>
                </View>
                <View style={{flex: 0.2, alignItems: 'center', margin: 10, justifyContent: 'flex-end'}}>
                    <Text style={[styles.item_title, {textAlign: 'center', fontSize: 15}]}>
                        By using this application, you agree to the Terms of Service and Privacy Policy
                    </Text>
                    <View style={{alignItems: 'center', marginTop: 10}}>
                        <Link
                            action={() => this.props.navigator.push({id: 'TermsPage'})}
                            text={'View Terms of Service'}
                            color={colors.action}
                        />
                    </View>
                </View>
                <View style={{flex: 0.2, justifyContent: 'center'}}>
                    <View style={{margin: 15}}>
                        {error}{content}
                    </View>
                </View>
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

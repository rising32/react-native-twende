'use strict';

var React = require('react');
var ReactNative = require('react-native');

var {
    Alert,
    View,
    Text,
    ToastAndroid,
    ActivityIndicator,
    TextInput,
    Navigator,
    TouchableHighlight,
    Image
    } = ReactNative;

import {colors, styles} from "../Styles";
import Avatar from "../Components/Avatar";
var IconText = require('../Components/IconText');
const FacebookLogin = require('react-native-facebook-login');
var { FBLogin, FBLoginManager } = FacebookLogin;
import events from "../Constants/Events";
var SheetIcon = require('../Components/SheetIcon');
import Dispatcher from "../Dispatcher";
import CurrentUserStore from '../Stores/CurrentUserStore';
import { loginCurrentUser }  from '../Actions/CurrentUserActions';
import { loadFacebookUser, reloadFacebookUser }  from '../Actions/SocialActions';



var LoginPage = React.createClass({

    getInitialState: function () {
        return {
            error: false,
            loading: false,
            animating: true,
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

    componentDidMount: function() { 
        this.setToggleTimeout(); 
    },

    componentWillUnmount: function () {
        this.removeListeners();
        clearTimeout(this._timer);
    },

    setToggleTimeout: function() { 
        this._timer = setTimeout(() => { 
            this.setState({ animating: false });
            this.setToggleTimeout(); 

        }, 2000); 
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
        const {animating} = this.state;
        var error = this.state.error ?
            <IconText color={colors.error} icon={"error"} text={"Error logging in"}/> : null;

        var spinner;
        if (this.state.ready || this.state.animating) {
            spinner = (
                <View style={styles.component2}>
                    <ActivityIndicator 
                    size={50}
                    color={colors.grey} 
                    /> 
                </View>
            );
        }

        let fbToken;

        return (
            <View style={styles.loginPage}>
                <View style={styles.empty_view_loginpage}>
                </View>     
                <View style={styles.empty_view_loginpage}>
                </View>
                <Avatar/>
                <View style={styles.text_box}>
                    <Text style={styles.item_title}>
                        Karibu!
                    </Text>
                    <Text style={styles.text_finalize}>
                        By using this application, you agree to the Terms of Service and Privacy Policy {'\n'} 
                    </Text>
                    <SheetIcon
                        action={() => this.props.navigator.push({id: 'TermsPage'})}
                        text={'VIEW TERMS OF SERVICE'}
                        fontfamily={'gothamrounded_bold'}
                        name={'library-books'}
                        color={colors.white}
                        size={20}
                        backgroundColor={colors.secondary}
                        width={27}
                        height={27}
                        text_color={colors.secondary}
                    />
                </View>
                <View style={styles.empty_view_loginpage}>

                    <FBLogin
                        style={styles.login_button}
                        onClickColor={colors.background}
                        permissions={["email"]}
                        loginBehavior={FBLoginManager.LoginBehaviors.Native}
                        icon={'phone'}
                        facebookText={"FACEBOOK LOGIN"}
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
                        }}
                    />
                    
                </View>
                <View style={styles.activity_indicator}> 
                    {spinner}
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

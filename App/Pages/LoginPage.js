'use strict';

var React = require('react-native');

var {
    View,
    Text,
    TextInput,
    Navigator,
    TouchableHighlight,
    } = React;

import {colors, styles} from "../Styles";
var IconText = require('../Components/IconText');
const FBSDK = require('react-native-fbsdk');
const {
    LoginButton,
    } = FBSDK;
import events from "../Constants/Events";
import Dispatcher from "../Dispatcher";
import CurrentUserStore from '../Stores/CurrentUserStore';
import { loginCurrentUser }  from '../Actions/CurrentUserActions';


var LoginPage = React.createClass({

    getInitialState: function() {
        return {
            error: false,
            loading: false,
            currentUser: {},
            username: 'test',
            password: 'test'
        };
    },

    componentDidMount: function (props) {
        CurrentUserStore.on(events.loginFailed, (error) => {
            this.setState({
                currentUser: {},
                error: true
            });
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

    renderScene: function (route, navigator) {
        var error = this.state.error ? <IconText color={colors.error} icon={"error"} text={"Error logging in"}/> : null;
        return (
            <View style={[styles.page, styles.page_full, styles.card]}>
                {error}
                <Text>Hierrr: {this.state.error}</Text>
                <TextInput
                    placeholder={"Username"}
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({username: text})}
                    style={styles.text_input}
                    value={this.state.username}
                />
                <TextInput
                    placeholder={"Password"}
                    secureTextEntry={true}
                    onChangeText={(text) => this.setState({password: text})}
                    style={styles.text_input}
                    value={this.state.password}
                />
                <TouchableHighlight
                    style={styles.primary_button}
                    onPress={this.login}
                >
                    <Text style={styles.primary_button_text}>LOGIN</Text>
                </TouchableHighlight>
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

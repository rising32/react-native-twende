'use strict';

var React = require('react-native');

var {
    View,
    Text,
    TextInput,
    Navigator,
    TouchableHighlight,
    } = React;


var AuthServices = require('../Services/AuthServices');
var CurrentUserStore = require('../Stores/CurrentUserStore');
import {colors, styles} from "../Styles";
var IconText = require('../Components/IconText');
const FBSDK = require('react-native-fbsdk');
const {
    LoginButton,
    } = FBSDK;

var LoginPage = React.createClass({

    componentWillMount: function (props) {
        CurrentUserStore.addListener((currentUser) => {
            this.setState({
                loading: false
            });
            if (currentUser) {
                if (currentUser.is_driver) {
                    this.props.navigator.push({id: 'DriverHomePage'});
                } else {
                    this.props.navigator.push({id: 'DriverListPage'});
                }
            } else {
                this.setState({error: true, password: ''});
            }
        });
        this.state = {
            error: false,
            loading: false,
            currentUser: null,
            username: 'test',
            password: 'test'
        };
    },

    componentWillUnmount: function () {
        //CurrentUserStore.clearListeners();
    },

    login: function () {
        this.setState({
            loading: true,
            error: false
        });
        console.log('logging in...');
        AuthServices.login(this.state.username, this.state.password);
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

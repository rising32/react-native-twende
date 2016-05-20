'use strict';

var React = require('react-native');
var {
    View,
    Text,
    TextInput,
    Navigator,
    Image,
    TouchableOpacity,

    } = React;

import {colors, styles} from "../Styles";
var NavIcon = require('../Components/NavIcon');
var IconText = require('../Components/IconText');
var Link = require('../Components/Link');
var Iconed = require('../Components/Iconed');
var SheetIcon = require('../Components/SheetIcon');
import { Avatar, Button, Icon } from 'react-native-material-design';
var ImagePickerManager = require('NativeModules').ImagePickerManager;
var CurrentUserActions = require('../Actions/CurrentUserActions');
import Camera from 'react-native-camera';

import { saveCurrentUser }  from '../Actions/CurrentUserActions';

var config = require('../../config');


var ProfilePage = React.createClass({

    getInitialState: function () {
        return {
            first_name: this.props.currentUser.first_name,
            last_name: this.props.currentUser.last_name,
            email: this.props.currentUser.email,
            phone: this.props.currentUser.phone

        }
    },


    componenWillMount: function () {
        GeoLocationStore.refresh();
    },

    componentWillUnmount: function () {
        this.saveUser();
    },

    saveUser: function () {
        var currentUser = this.props.currentUser;
        currentUser.first_name = this.state.first_name;
        currentUser.last_name = this.state.last_name;
        currentUser.email = this.state.email;
        currentUser.phone = this.state.phone;
        if (this.state.picture) {
            currentUser.picture = this.state.picture;
        }
        saveCurrentUser(currentUser);
    },

    takePicture: function () {
        ImagePickerManager.launchCamera(config.camera_options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePickerManager Error: ', response.error);
            }
            else {
                const source = {uri: response.uri, isStatic: true};
                this.setState({
                    preview: source,
                    picture: response.data
                });
            }
        });
    },

    render: function () {
        return (
            <Navigator
                renderScene={this.renderScene}
                navigator={this.props.navigator}
                navigationBar={
            <Navigator.NavigationBar style={styles.nav_bar}
                routeMapper={NavigationBarRouteMapper} />
          }/>
        );
    },

    renderScene: function (route, navigator) {
        var image;
        if (this.state.preview) {
            image = <Image
                style={{height: 200, width: 200}}
                source={this.state.preview}
            />

        } else {
            image = <Image
                style={{height: 200, width: 200}}
                source={{uri: config.mediaUrl + this.props.currentUser.avatar}}
            />
        }

        return (
            <View style={styles.page}>
                <View style={{height: 200, backgroundColor: '#e0e0e0', alignItems: 'center'}}>
                    {image}
                </View>
                <View style={styles.sheet}>
                    <SheetIcon
                        icon={'camera-alt'}
                        action={this.takePicture}
                    />
                    <View style={styles.sheet_content}>
                        <Iconed icon="person" size={24} color={colors.action_secondary}>
                            <TextInput
                                placeholder={"First name"}
                                autoCorrect={false}
                                onChangeText={(text) => this.setState({first_name: text})}
                                style={{borderColor: 'gray', borderWidth: 1, flex: 1, color: colors.action_secondary}}
                                value={this.state.first_name}
                            />
                            <TextInput
                                placeholder={"First name"}
                                autoCorrect={false}
                                onChangeText={(text) => this.setState({last_name: text})}
                                style={{borderColor: 'gray', borderWidth: 1, flex: 1, color: colors.action_secondary}}
                                value={this.state.last_name}
                            />
                        </Iconed>
                        <Iconed icon="local-phone" size={24} color={colors.action_secondary}>
                            <TextInput
                                placeholder={"Phone number"}
                                autoCorrect={false}
                                onChangeText={(text) => this.setState({phone: text})}
                                style={{borderColor: 'gray', borderWidth: 1, flex: 1, color: colors.action_secondary}}
                                value={this.state.phone}
                            />
                        </Iconed>
                        <Iconed icon="email" size={24} color={colors.action_secondary}>
                            <TextInput
                                placeholder={"E-mail address"}
                                autoCorrect={false}
                                onChangeText={(text) => this.setState({email: text})}
                                style={{borderColor: 'gray', borderWidth: 1, flex: 1, color: colors.action_secondary}}
                                value={this.state.email}
                            />
                        </Iconed>
                    </View>
                </View>
            </View>
        );
    }
});


var NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, nextState) {
        return (
            <NavIcon
                icon={"arrow-back"}
                action={() => {navigator.parentNavigator.replace({id: 'CurrentLocationPage'})}}
            />
        );
    },
    RightButton(route, navigator, index, nextState) {
        return null;
    },
    Title(route, navigator, index, nextState) {
        return (
            <Text style={styles.nav_title}>
                MY PROFILE
            </Text>
        );
    }
};


module.exports = ProfilePage;

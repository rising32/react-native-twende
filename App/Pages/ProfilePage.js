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


var ProfilePage = React.createClass({

    getInitialState: function () {
        return {
            currentUser: this.props.currentUser,
        }
    },


    componenWillMount: function () {
        GeoLocationStore.refresh();
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
        return (
            <View style={styles.page}>
                <View style={{height: 200, backgroundColor: '#e0e0e0', alignItems: 'center'}}>
                    <Image
                        style={{height: 200, width: 200}}
                        source={{uri: 'http://twende.loekvan.gent/' + this.props.currentUser.avatar}}
                    />
                </View>
                <View style={styles.sheet}>
                    <SheetIcon
                        icon={'camera-alt'}
                        onPress={this.takePicture}
                    />
                    <View style={styles.sheet_content}>
                        <Iconed icon="person" size={24} color={colors.action_secondary}>
                            <TextInput
                                placeholder={"Your name"}
                                autoCorrect={false}
                                onChangeText={(text) => this.setState({name: text})}
                                style={{borderColor: 'gray', borderWidth: 1, flex: 1, color: colors.action_secondary}}
                                value={this.props.currentUser.name}
                            />
                        </Iconed>
                        <Iconed icon="local-phone" size={24} color={colors.action_secondary}>
                            <TextInput
                                placeholder={"Phone number"}
                                autoCorrect={false}
                                onChangeText={(text) => this.setState({name: text})}
                                style={{borderColor: 'gray', borderWidth: 1, flex: 1, color: colors.action_secondary}}
                                value={this.props.currentUser.phone}
                            />
                        </Iconed>
                        <Iconed icon="email" size={24} color={colors.action_secondary}>
                            <TextInput
                                placeholder={"E-mail address"}
                                autoCorrect={false}
                                onChangeText={(text) => this.setState({name: text})}
                                style={{borderColor: 'gray', borderWidth: 1, flex: 1, color: colors.action_secondary}}
                                value={this.props.currentUser.email}
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
                icon={"menu"}
                action={() => navigator.parentNavigator.props.drawer.openDrawer()}
            />
        );
    },
    RightButton(route, navigator, index, nextState) {
        return (
            <NavIcon
                icon={"motorcycle"}
                action={() => navigator.parentNavigator.props.goToPage('HomePage')}
            />
        );
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

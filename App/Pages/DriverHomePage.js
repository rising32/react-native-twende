'use strict';

var React = require('react-native');
var {
    Component,
    View,
    Text,
    Navigator,
    TouchableOpacity,
    } = React;

import {
    MKSwitch,
} from 'react-native-material-kit';


var CurrentUserStore = require('../Stores/CurrentUserStore');
var GeoLocationStore = require('../Stores/GeoLocationStore');
var RequestStore = require('../Stores/RequestStore');
var RequestService = require('../Services/RequestService');
var NavIcon = require('../Components/NavIcon');
var IconText = require('../Components/IconText');
var Avatar = require('../Components/Avatar');
var Link = require('../Components/Link');
import {colors, styles} from "../Styles";
import MapView from 'react-native-maps';


var DriverHomePage = React.createClass({

    getInitialState: function(props) {
        return {
            position: {},
            items: []
        }
    },

    refreshItems: function(){
        RequestService.getItems();
    },

    componentWillMount: function() {
        GeoLocationStore.startWatching();
        RequestStore.addListener((items) => {
            this.setState({items: items});
        });
        this.setState({currentUser: this.props.state.currentUser});
        this.refreshItems();

    },

    componentWillUnmount: function() {
        //GeoLocationStore.stopWatching();
    },

    render: function() {
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

    renderEmpty: function() {
        return  (
            <View style={{alignItems: 'center'}}>
                <IconText
                    icon={"schedule"}
                    text={"Waiting for a ride"}
                    color={colors.action_secondary}
                    style={{margin: 10}}
                />
            </View>
        );

    },

    renderRequest: function() {
        var ride = this.state.items[0];
        return  (
            <View style={{alignItems: 'center'}}>
                <Avatar image={ride.created_by.avatar} />
                <Text>
                    {ride.created_by.name}
                </Text>
                <IconText
                    icon={"motorcycle"}
                    text={ride.destination_text}
                    color={colors.action_secondary}
                    style={{margin: 10}}
                />
            </View>
        );

    },


    renderScene: function(route, navigator) {
        var content;
        if (this.state.items.length == 0) {
            content = this.renderEmpty();
        } else {
            content = this.renderRequest();

        }

        return (
            <View style={styles.page}>
                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Text>
                        Not available
                    </Text>
                    <MKSwitch
                        color={colors.action}
                        checked={this.state.props.currentUser.is_available}
                    />
                    <Text>
                        Available
                    </Text>
                </View>
                <View style={styles.sheet_dark}>
                    {content}
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
        return null;
    },
    Title(route, navigator, index, nextState) {
        return (
            <Text style={styles.nav_title}>
                DRIVER HOME
            </Text>
        );
    }
};

module.exports = DriverHomePage;

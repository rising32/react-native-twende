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
import CustomerStore from '../Stores/CustomerStore';
var MapView = require('react-native-maps');

var NavIcon = require('../Components/NavIcon');
var IconText = require('../Components/IconText');
var Avatar = require('../Components/Avatar');
var Link = require('../Components/Link');
import {colors, styles} from "../Styles";
import events from "../Constants/Events";
import {loadCustomerList} from "../Actions/CustomerActions";
import { updateCurrentRide } from "../Actions/CurrentRideActions";
import { startWatchingGeoLocation,
         stopWatchingGeoLocation } from "../Actions/GeoLocationActions";


var DriverRidePage = React.createClass({

    getInitialState: function () {
        return {
            currentUser: this.props.currentUser,
            currentRide: this.props.currentRide,
            driver: this.props.driver
        }

    },

    componentWillMount: function() {
        startWatchingGeoLocation();
        CustomerStore.on(events.customerListLoaded, this.setItems);
        this.refreshItems();

    },

    componentWillUnmount: function() {
        stopWatchingGeoLocation();
        CustomerStore.removeListener(events.customerListLoaded, this.setItems);
    },

    refreshItems: function(){
        loadCustomerList();
    },

    toggleAvailability: function(available) {
        var currentUser = this.state.currentUser;
        currentUser.is_available = available.checked;
        this.setState({currentUser: currentUser});
    },

    acceptRide: function(ride) {
        ride.state = 'accepted';
        updateCurrentRide(ride);
    },

    declineRide: function(ride) {
        ride.state = 'declined';
        updateCurrentRide(ride);
    },

    setItems: function(items) {
        this.setState({items: items});
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
    renderUnavailable: function() {
        return  (
            <View style={{alignItems: 'center'}}>
                <IconText
                    icon={"not-interested"}
                    text={"You're unavailable and won't get any request."}
                    color={colors.action_secondary}
                    style={{margin: 10}}
                />
            </View>
        );

    },

    renderRequest: function() {
        var ride = this.state.items[0];
        return  (
            <View>

                <View style={{alignItems: 'center'}}>
                    <View style={styles.card_mid_spacer} />
                    <View style={styles.card_mid_avatar}>
                    <Avatar image={ride.customer.avatar} />
                    </View>
                    <View style={styles.card_mid}>
                        <Text>
                            {ride.customer.name}
                        </Text>
                        <Link
                            icon={"motorcycle"}
                            url={"geo:" + ride.latitude + ","  + ride.longitude}
                            text={ride.origin_text}
                            color={colors.action}
                            style={{margin: 10}}
                        />
                        <View style={styles.card_mid_actions}>
                            <Link
                                action={() => this.declineRide(ride)}
                                style={styles.button_simple}
                                text={"DECLINE"}
                                textStyle={{fontWeight: 'bold'}}
                                color={colors.action_secondary}
                                />
                            <Link
                                action={() => this.acceptRide(ride)}
                                style={styles.button_simple}
                                text={"ACCEPT"}
                                textStyle={{fontWeight: 'bold'}}
                                color={colors.action}
                                />
                        </View>
                    </View>
                </View>
            </View>
        );
    },


    renderScene: function(route, navigator) {
        var content;
        if (this.state.currentUser.is_available) {
            if (this.state.items.length == 0) {
                content = this.renderEmpty();
            } else {
                content = this.renderRequest();
            }
        } else {
            content = this.renderUnavailable();
        }

        return (
            <View style={styles.page}>
                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Text>
                        Not available
                    </Text>
                    <MKSwitch
                        color={colors.action}
                        onCheckedChange={this.toggleAvailability}
                        checked={this.state.currentUser.is_available}
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
    },
    Title(route, navigator, index, nextState) {
        return (
            <Text style={styles.nav_title}>
                DRIVER HOME
            </Text>
        );
    }
};

module.exports = DriverRidePage;

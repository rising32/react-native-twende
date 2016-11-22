'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Text,
    ToastAndroid,
    Navigator,
    TouchableHighlight
    } = ReactNative;

var MapView = require('react-native-maps');
import { loadGeoLocation } from "../Actions/GeoLocationActions";
var CurrentRideActions = require('../Actions/CurrentRideActions');
var NavIcon = require('../Components/NavIcon');
import { Avatar, Button, Icon } from 'react-native-material-design';
import {colors, styles} from "../Styles";
var SheetIcon = require('../Components/SheetIcon');
import GeoLocationStore from '../Stores/GeoLocationStore';
import CurrentUserStore from '../Stores/CurrentUserStore';
import CurrentRideStore from '../Stores/CurrentRideStore';
import {
    createCurrentRide,
    loadRideList } from '../Actions/CurrentRideActions';
import events from "../Constants/Events";


var CurrentLocationPage = React.createClass({

    getInitialState: function () {
        return {
            currentUser: this.props.currentUser,
            origin_text: '- finding your location -',
            origin: {
                latitude: -1.23825,
                longitude: 35.8724
            },
            isLoading: false,
            status: 'new',
            region: {
                latitude: -1.23825,
                longitude: 35.8724,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }
        }
    },

    updateLocation: function(loc) {
        ToastAndroid.show('Found location', ToastAndroid.SHORT);
        var myLoc = 'location found';
        this.setState({
            origin: {
                latitude: loc.latitude,
                longitude: loc.longitude
            },
            region: {
                latitude: loc.latitude,
                longitude: loc.longitude,
                latitudeDelta: this.state.region.latitudeDelta,
                longitudeDelta: this.state.region.longitudeDelta
            },
            origin_text: myLoc
        });
    },

    componentDidMount: function (props) {
        CurrentRideStore.on(events.currentRideLoaded, this.rideLoaded);
        GeoLocationStore.on(events.geoLocationLoaded, this.updateLocation);
        loadRideList();
        loadGeoLocation();
        loadGeoLocation(true);
    },

    refreshLocation: function() {
        ToastAndroid.show('Refreshing location', ToastAndroid.SHORT);
        loadGeoLocation();
        loadGeoLocation(true);
    },

    stopListening: function() {
        CurrentRideStore.removeListener(events.currentRideLoaded, this.nextStep);
        GeoLocationStore.removeListener(events.geoLocationLoaded, this.updateLocation);
    },

    componentWillUnmount: function (props) {
        this.stopListening();
    },

    dragOrigin: function (loc) {
        var myLoc = Math.round(10000 * loc.latitude) / 10000 + ' x ' + Math.round(10000 * loc.longitude) / 10000;
        this.setState({
            origin: loc,
            region: {
                latitude: loc.latitude,
                longitude: loc.longitude,
                latitudeDelta: this.state.region.latitudeDelta,
                longitudeDelta: this.state.region.longitudeDelta
            },
            origin_text: myLoc
        });
    },

    onRegionChange: function (region) {
        this.setState({region: region});
    },

    nextStep: function (currentRide) {
        var finalStates = ['finalized', 'cancelled', 'declined'];
        if (finalStates.indexOf(currentRide.state) > -1) {
            return;
        }
        if (currentRide.driver) {
            this.stopListening();
            // There was already an active ride... got to that one
            this.props.navigator.push({
                id: 'CurrentRidePage',
                currentRide: currentRide,
                driver: currentRide.driver
            });
        } else if (this.state.ready) {
            this.stopListening();
            // New ride. Go to driver list
            this.props.navigator.push({
                id: 'DriverListPage',
                currentRide: currentRide
            });
        }
    },

    createRide: function() {
        var ride = {
            origin:      this.state.origin,
            origin_text: this.state.origin_text
        };
        this.setState({
            ready: true
        });
        createCurrentRide(ride);
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
        var locationInput = null;
        var spinner;
        if (this.state.ready) {
            spinner = (
                <View style={styles.spinner}>
                    <Text>Loading riders...</Text>
                </View>
            );
        }
        return (
            <View style={styles.page}>
                <View style={styles.map_container}>
                    <MapView
                        region={this.state.region}
                        showsUserLocation={true}
                        onRegionChange={this.onRegionChange}
                        showUserLocation={true}
                        style={styles.map}>
                        <MapView.Marker
                            draggable
                            pinColor="purple"
                            image={require('../assets/map-customer.png')}
                            coordinate={this.state.origin}
                            onDragEnd={(e) => this.dragOrigin(e.nativeEvent.coordinate)}
                        />
                    </MapView>
                    <View style={[styles.map_info, {marginTop: -290}]}>
                        <Text />
                        <View style={styles.map_info_container}>
                            <Text style={styles.map_text}>
                                Pick-up Location
                            </Text>
                            <Text style={styles.map_title}>
                                {this.state.origin_text}
                            </Text>
                        </View>

                        <TouchableHighlight
                            onPress={this.refreshLocation}
                            style={styles.map_info_action}
                        >
                            <View>
                                <Icon name="gps-fixed" size={24} color={colors.action_secondary} />
                            </View>
                        </TouchableHighlight>

                    </View>
                </View>
                <View style={[styles.sheet, {flex: 1}]}>
                    <SheetIcon
                        icon={'done'}
                        action={this.createRide}
                    />
                    <View style={styles.sheet_content}>
                        <Text style={styles.item_title}>
                            {this.state.currentUser.first_name} {this.state.currentUser.last_name}
                        </Text>
                        <Text>
                            Set your pickup location. Hold and then drag the
                            red balloon to change your pick up location.
                        </Text>
                    </View>
                </View>
                {spinner}
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
        this.currentUser = CurrentUserStore.get();
        return (
            <Text style={styles.nav_title}>
                MY LOCATION
            </Text>
        );
    }
};

module.exports = CurrentLocationPage;

'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    View,
    Image,
    Alert,
    Text,
    ActivityIndicator,
    ToastAndroid,
    Navigator,
    TouchableHighlight
    } = ReactNative;

const MapView = require('react-native-maps');
const CurrentRideActions = require('../Actions/CurrentRideActions');
const NavIcon = require('../Components/NavIcon');
const Button = require('../Components/Button');
const Link = require('../Components/Link');
const SheetIcon = require('../Components/SheetIcon');

import { loadGeoLocation } from "../Actions/GeoLocationActions";
import Avatar from "../Components/Avatar";
import GeoLocationStore from '../Stores/GeoLocationStore';
import CurrentUserStore from '../Stores/CurrentUserStore';
import CurrentRideStore from '../Stores/CurrentRideStore';
import {colors, styles} from "../Styles";
import {
    createCurrentRide,
    loadRideList } from '../Actions/CurrentRideActions';
import events from "../Constants/Events";

const CurrentLocationPage = React.createClass({

    getInitialState: function () {
        if (!this.props.currentUser.position) {
            this.props.currentUser.position = {
                latitude: 0,
                longitude: 0
            }
        }

        return {
            origin_text: '- finding your location -',
            origin: {
                latitude: 0,
                longitude: 0
            },
            isLoading: false,
            status: 'new',
            animating: true,
            phone: this.props.currentUser.phone,
            region: {
                latitude: -1.283333,
                longitude: 36.816667,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }
        }
    },

    updateLocation: function(loc) {
        let myLoc = 'location found';
        this.props.currentUser.position = loc;
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

    componentWillMount: function (props) {
        GeoLocationStore.on(events.geoLocationLoaded, this.updateLocation);
        this.setState({
            ready: false
        });
        loadGeoLocation();
        loadGeoLocation(true);
    },

    componentWillUnmount: function() {
        GeoLocationStore.removeListener(events.geoLocationLoaded, this.updateLocation);
        clearTimeout(this._timer);
    },

    refreshLocation: function() {
        loadGeoLocation();
        loadGeoLocation(true);
    },

    mapMoved: function(region) {
        this.setState({
            region: region,
            origin: {
                latitude: region.latitude,
                longitude: region.longitude
            }
        })
    },

    createRide: function() {
        if (this.props.currentUser.phone == "") {
            Alert.alert(
                'Phone number required to request ride',
                'Please fill out your phone number in My Profile in the left above corner.',
                [
                    {text: 'Cancel'},
                    {text: 'Go to profile page', onPress: () => this.props.navigator.push({id: 'ProfilePage'})},
                ],
                {cancelable: false}
            );
        } else if (this.state.origin.latitude == 0) {
            Alert.alert(
                'Pick up location not set',
                'Make sure location service is enabled..',
                [
                    {text: 'OK'}
                ],
                {cancelable: false}
            );
        } else {
            let ride = {
                origin: this.state.origin,
                origin_text: this.state.origin_text
            };
            this.setState({
                ready: true
            });
            createCurrentRide(ride);
        }
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
        const {animating} = this.state;
        let locationInput = null;
        let spinner;
        if (this.state.ready) {
            spinner = (
                <View style={styles.activity_indicator_pickup}> 
                    <View style={styles.activity_indicator_container}>
                        <ActivityIndicator 
                            animating={this.state.animating}
                            size={50}
                            color={colors.grey} 
                        /> 
                    </View>
                </View>
            );
        }

        let pickup;
        let customer;
        if (this.state.origin.latitude && this.state.origin.longitude) {
            pickup = <MapView.Marker
                pinColor = "yellow"
                title = "You"
                description = "Pick up location"
                image = {require('../assets/map-customer-invisible.png')}
                coordinate = {this.state.origin} />
            customer = (
                <View style={styles.map_marker_container}>
                    <View style={styles.map_marker}>
                        <Image
                            source={require('../assets/map-customer.png')}
                        />
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.page}>
                <View style={styles.map_container}>
                    <MapView
                        region={this.state.region}
                        onRegionChange={this.mapMoved}
                        showsMyLocationButton={true}
                        showsUserLocation={true}
                        showUserLocation={false}
                        style={styles.map}>
                        {pickup}
                    </MapView> 
                    {spinner}
                    {customer}
                </View>
                <View style={{alignItems: 'center', marginTop: -36}}>
                    <Avatar image={this.props.currentUser.avatar}/>
                    <Text style={styles.item_title}>
                        Karibu {this.props.currentUser.first_name}!
                    </Text>
                    <Text style={styles.text}>
                        Swipe the map to change your pick up location
                    </Text>
                </View>
                <View style={styles.primary_button_customer_app}>                       
                    <Button
                        action={this.createRide}
                        text={"CONFIRM LOCATION"}
                        color={colors.action}
                    />
                </View>
            </View>
        );
    }
});

let NavigationBarRouteMapper = {
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
                PICK UP LOCATION
            </Text>
        );
    }
};

module.exports = CurrentLocationPage;
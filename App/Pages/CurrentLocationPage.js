'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Alert,
    Text,
    ToastAndroid,
    Navigator,
    TouchableHighlight
    } = ReactNative;

var MapView = require('react-native-maps');
import { loadGeoLocation } from "../Actions/GeoLocationActions";
var CurrentRideActions = require('../Actions/CurrentRideActions');
var NavIcon = require('../Components/NavIcon');
import { Avatar, Icon } from 'react-native-material-design';
var Button = require('../Components/Button');
import {colors, styles} from "../Styles";
var Link = require('../Components/Link');
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

        if (!this.props.currentUser.position) {
            this.props.currentUser.position = {
                latitude: -1.23825,
                longitude: 35.8724
            }
        }

        return {
            origin_text: '- finding your location -',
            origin: {},
            isLoading: false,
            status: 'new',
            phone: this.props.currentUser.phone,
            region: {
                latitude: this.props.currentUser.position.latitude,
                longitude: this.props.currentUser.position.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }
        }
    },

    updateLocation: function(loc) {
        var myLoc = 'location found';
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
        loadGeoLocation();
        loadGeoLocation(true);
    },

    refreshLocation: function() {
        loadGeoLocation();
        loadGeoLocation(true);
    },

    componentWillUnmount: function() {
        GeoLocationStore.removeListener(events.geoLocationLoaded, this.updateLocation);
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

    locationAlert : function() {
        Alert.alert(
            'Location not recognized',
            'You seem to have your location off. Please switch it on or try outside! :)',
            [
                {text: 'OKAY!'}
            ]
        );
    },

createRide: function() {
    ;
        if (this.props.currentUser.phone != "") {
            var ride = {
                origin:      this.state.origin,
                origin_text: this.state.origin_text
            };
            this.setState({
                ready: true
            });
            createCurrentRide(ride);
            
         } else { 
            Alert.alert(
                'Phone number required to request ride',
                'Please fill out your phone number in My Profile in the left above corner.',
                    [
                        {text: 'OK'}
                    ],
                    { cancelable: false}
                );


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
        var locationInput = null;
        var spinner;
        if (this.state.ready) {
            spinner = (
                <View style={styles.spinner}>
                    <Text style={styles.spinner_text}>Loading riders...</Text>
                </View>
            );
        }

        var pickup;

        if (this.state.origin.latitude && this.state.origin.longitude) {
            pickup = <MapView.Marker
                draggable
                pinColor = "yellow"
                title = "You"
                description = "Pick up location"
                image = {require('../assets/map-customer.png')}
                coordinate = {this.state.origin}
                onDragEnd = {(e) => this.dragOrigin(e.nativeEvent.coordinate)}/>
        }   else {
                Alert.alert(
                'You appear offline',
                'You seem to be out of wireless juice. Please connect.',
                [
                    {text: 'OKAY!'}
                ]
            );
        }
        
        return (
            <View style={styles.page}>
                <View style={styles.map_container}>
                    <MapView
                        region={this.state.region}
                        onRegionChange={this.onRegionChange}
                        showsMyLocationButton={true}
                        showsUserLocation={true}
                        showUserLocation={true}
                        style={styles.map}>
                        {pickup}
                    </MapView>
                    {spinner}
                </View>
                <View style={{alignItems: 'center', marginTop: 10}}>
                    <Text style={styles.item_title}>
                        Karibu {this.props.currentUser.first_name}!
                    </Text>
                    <Text style={styles.text_important}>
                        If location is not correct please drag pin.
                    </Text>
                </View>
                <View style={{flexDirection: 'row', margin: 16}}>                          
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
                PICK UP LOCATION
            </Text>
        );
    }
};

module.exports = CurrentLocationPage;

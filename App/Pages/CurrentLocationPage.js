'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Platform,
    Text,
    TextInput,
    Navigator,
    TouchableOpacity,
    TouchableHighlight
    } = ReactNative;
var MapView = require('react-native-maps');
var CurrentUserStore = require('../Stores/CurrentUserStore');
var GeoLocationStore = require('../Stores/GeoLocationStore');
var RideActions = require('../Actions/RideActions');
var RideStore = require('../Stores/RideStore');
var NavIcon = require('../Components/NavIcon');
import { Avatar, Button, Icon } from 'react-native-material-design';
import {colors, styles} from "../Styles";
var SheetIcon = require('../Components/SheetIcon');

var CurrentLocationPage = React.createClass({

    getInitialState: function () {
        return {
            currentUser: CurrentUserStore.get(),
            origin_text: '',
            origin: {
                latitude: -1.23825,
                longitude: 35.8724
            },
            status: 'new',
            region: {
                latitude: -1.23825,
                longitude: 35.8724,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }
        }

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
        })
    },

    onRegionChange: function (region) {
        this.setState({region: region});
    },

    refreshLocation: function () {
        this.setState({'origin_text': '- refreshing -'});
        console.log('Refresh location');
        GeoLocationStore.refresh((loc) => {
            var myLoc = Math.round(10000 * loc.latitude) / 10000 + ' x ' + Math.round(10000 * loc.longitude) / 10000;
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
        });
    },

    togglePickupSearch: function () {
        if (this.state.pickupSearch) {
            this.setState({pickupSearch: false});
        } else {
            this.setState({pickupSearch: true});

        }
    },

    setPickupLocation: function () {
        this.setState({pickupSearch: false})
    },

    nextStep: function () {
        var navigator = this.props.navigator;
        var ride = {
            origin:      this.state.origin,
            origin_text: this.state.origin_text
        };

        RideActions.create(ride);
        navigator.replace({id: 'DriverListPage'});
    },

    componentDidMount: function (props) {
        this.refreshLocation();
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


    renderPickupLocation: function () {
        if (this.state.pickupSearch) {
            return (
                <View style={styles.map_info_container}>
                    <Text style={styles.map_text}>
                        Where can I pick you up?
                    </Text>
                    <View style={{borderWidth: 3, borderColor: 'green'}}>
                        <TextInput
                            placeholder={"Pickup location"}
                            autoCorrect={false}
                            onChangeText={(text) => this.setState({origin_text: text})}
                            style={styles.text_input}
                            value={this.state.origin_text}
                        />
                    </View>
                    <TouchableHighlight
                        style={styles.primary_button}
                        onPress={this.togglePickupSearch}
                    >
                        <Text style={styles.primary_button_text}>SET</Text>
                    </TouchableHighlight>
                </View>
            );
        } else {
            return (
                <View style={styles.map_info_container}>
                    <Text style={styles.map_text}>
                        Pick-up Location
                    </Text>
                    <Text style={styles.map_title}>
                        {this.state.origin_text}
                    </Text>
                </View>
            );
        }
    },

    renderScene: function (route, navigator) {
        var locationInput = null;
        var pickupLocation = this.renderPickupLocation();
        return (
            <View style={styles.page}>
                <View style={styles.map}>
                    <MapView
                        region={this.state.region}
                        showsUserLocation={true}
                        onRegionChange={this.onRegionChange}
                        //showUserLocation={true}
                        style={{height:300, borderWidth:4, borderColor:'#FFFF00'}}
                    >
                        <MapView.Marker
                            draggable
                            coordinate={this.state.origin}
                            onDragEnd={(e) => this.dragOrigin(e.nativeEvent.coordinate)}
                        />
                    </MapView>
                    <View style={[styles.map_info, {marginTop: -290}]}>
                        <TouchableHighlight
                            onPress={this.togglePickupSearch}
                            style={styles.map_info_action}
                        >
                            <View>
                                <Icon name="search" size={16} color={colors.action_secondary}/>
                            </View>
                        </TouchableHighlight>

                        {pickupLocation}

                        <TouchableHighlight
                            onPress={this.refreshLocation}
                            style={styles.map_info_action}
                        >
                            <View>
                                <Icon name="gps-fixed" size={16} color={colors.action_secondary}/>
                            </View>
                        </TouchableHighlight>

                    </View>
                </View>
                <View style={[styles.sheet, {flex: 1}]}>
                    <SheetIcon
                        icon={'done'}
                        action={this.nextStep}
                    />
                    <View style={styles.sheet_content}>
                        <Text style={styles.item_title}>
                            {this.state.currentUser.name}
                        </Text>
                        <Text>
                            Set your pickup location...
                        </Text>
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
        this.currentUser = CurrentUserStore.get();
        return (
            <Text style={styles.nav_title}>
                MY LOCATION
            </Text>
        );
    }
};

module.exports = CurrentLocationPage;

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

var RequestRidePage = React.createClass({

    componentWillMount: function (props) {
    },

    getInitialState: function () {
        return {
            origin_text: '',
            destination: null,
            destination_text: '',
            driver: this.props.driver.id,
            status: 'new',
            latitude: -1,
            longitude: 35,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
            origin: {
                latitude: -1.23825,
                longitude: 35.8724
            },
            region: {
                latitude: -1.23825,
                longitude: 35.8724,
                latitudeDelta: 0.3,
                longitudeDelta: 0.3
            }
        }

    },

    dragOrigin: function(loc){
        var myLoc = Math.round(10000 * loc.latitude) / 10000 + ' x ' + Math.round(10000 * loc.longitude) / 10000;
        this.setState({
            origin: loc,
            origin_text: myLoc,
        })
    },

    onRegionChange: function(loc) {
        //this.setState(region);
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
                    latitudeDelta: this.state.latitudeDelta,
                    longitudeDelta: this.state.longitudeDelta
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

    componentDidMount: function (props) {
        this.refreshLocation();
    },

    nextStep: function () {
        console.log("Ride requested");
        RideStore.addListener((ride) => {
            let driver = this.props.driver
            if (Platform.OS === 'ios') {
                this.props.navigator.push({
                    id: 'CurrentRidePage',
                    passProps: {ride, driver}
                });
            } else {
                this.props.navigator.push({
                    id: 'CurrentRidePage',
                    ride: ride,
                    driver: driver
                });
            }

        });
        RideActions.create(this.state);
    },

    fuzzyDistance: function () {
        let dist = this.props.driver.distance;
        if (dist > 1000) {
            return Math.round(dist / 100) / 10 + 'km';
        }
        return Math.round(dist) + 'm';
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
                        style={{height:300, borderWidth:4, borderColor:'#FFFF00'}}
                    >
                        <MapView.Marker
                            draggable
                            coordinate={this.state.origin}
                            onDragEnd={(e) => this.dragOrigin(e.nativeEvent.coordinate)}
                        />

                    </MapView>
                    <View style={styles.map_info}>
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
                <View style={styles.sheet}>
                    <SheetIcon
                        icon={'done'}
                        action={this.nextStep}
                    />
                    <View style={styles.sheet_content}>
                        <Text style={styles.item_title}>
                            {this.props.driver.name}
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                            <Icon name="motorcycle" size={18} color={colors.secondary} style={{marginRight: 5}}/>
                            <Text style={styles.item_text}>
                                {this.fuzzyDistance()}
                            </Text>
                        </View>
                        <Text style={styles.text}>
                            Where can I take you today?
                        </Text>
                        <TextInput
                            placeholder={"Destination"}
                            autoCorrect={false}
                            onChangeText={(text) => this.setState({destination_text: text})}
                            style={styles.text_input}
                            value={this.state.destination_text}
                        />
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
        return null;
    },
    Title(route, navigator, index, nextState) {
        this.currentUser = CurrentUserStore.get();
        return (
            <Text style={styles.nav_title}>
                DESTINATION
            </Text>
        );
    }
};

module.exports = RequestRidePage;

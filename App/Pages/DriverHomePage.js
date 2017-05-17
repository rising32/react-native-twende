'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Alert,
    Linking,
    View,
    Text,
    TextInput,
    Switch,
    ActivityIndicator,
    Navigator,
    TouchableOpacity,
    ToastAndroid,
    Image
    } = ReactNative;

import CurrentRideStore from '../Stores/CurrentRideStore';
import CurrentUserStore from '../Stores/CurrentUserStore';
import GeoLocationStore from '../Stores/GeoLocationStore';
var Map = require('../Components/Map');
var NavIcon = require('../Components/NavIcon');
var IconText = require('../Components/IconText');
import { Icon } from 'react-native-material-design';
var Avatar = require('../Components/Avatar');
var Link = require('../Components/Link');
var Line = require('../Components/Line');
var Banner = require('../Components/Banner');
var Button = require('../Components/Button');
var SheetIcon = require('../Components/SheetIcon');
var SheetAvatar = require('../Components/SheetAvatar');
var Rating = require('../Components/Rating');
var StarRating = require('../Components/StarRating');
var Avatar = require('../Components/Avatar');

import {colors, styles} from "../Styles";
import events from "../Constants/Events";
import { updateCurrentRide,
         loadRideList,
         loadCurrentRide } from "../Actions/CurrentRideActions";
import { updateCurrentUser,
         reloadCurrentUser } from"../Actions/CurrentUserActions";
import { startWatchingGeoLocation,
         loadGeoLocation,
         stopWatchingGeoLocation } from "../Actions/GeoLocationActions";
import Timer from 'react-native-timer-component';
import TimerMixin from 'react-timer-mixin';
const timer = require('react-native-timer');


var DriverHomePage = React.createClass({

    getInitialState: function () {
        var region =  {
            latitude: this.props.currentUser.latitude,
            longitude: this.props.currentUser.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
        };
        if (this.props.currentRide.origin) {
            region['latitude'] =  this.props.currentRide.origin.latitude;
            region['longitude']= this.props.currentRide.origin.longitude;
        }
        return {
            currentUser: this.props.currentUser,
            currentRide: this.props.currentRide,
            region: region,
            trueSwitchIsOn: true,
            falseSwitchIsOn: false,
            rating: 0,
            price: 0,
            showMessage: true
        }
    },

    componentWillMount: function() {
        GeoLocationStore.on(events.geoLocationLoaded, this.updateLocation);
        loadGeoLocation();
        startWatchingGeoLocation();
    },

        componentDidMount() {
        this.showMessage();
    },

    componentWillUnmount: function() {
        GeoLocationStore.removeListener(events.geoLocationLoaded, this.updateLocation);
        stopWatchingGeoLocation();
        timer.clearTimeout(this);
    },

    // message when time is up when receiving request from customer
    showMessage: function () {
        this.setState({showMessage: true}, () => timer.setTimeout(
        this, 'hideMessage', () => this.setState({showMessage: false}), 30000
        ));
    },

    updateLocation: function(loc) {
        let currentUser = this.props.currentUser;
        currentUser.position = loc;
        let location = {
            user: currentUser.id,
            location: loc
        };
    },

    refreshItems: function(){
        ToastAndroid.show('Checking Customer Activity..', ToastAndroid.SHORT);
        loadRideList();
        reloadCurrentUser();
    },

    refreshRide: function() {
        ToastAndroid.show('Checking Customer Activity..', ToastAndroid.SHORT);
        loadCurrentRide(this.props.currentRide.id);
        reloadCurrentUser();
    },

    toggleAvailability: function(available) {
        var currentUser = this.state.currentUser;
        currentUser.state = available ? 'available' : 'unavailable';
        updateCurrentUser(currentUser);
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

    renderHeader: function (header) {
        return (
        <Text style={styles.item_title}>
            {header}
        </Text>
        )
    },

    renderText: function (text) {
        return (
            <Text style={styles.text_finalize}>
                {text}
            </Text>
        )
    },

    renderScene: function(route, navigator) {
        var is_available = this.state.currentUser.state == 'available';
        var header = this.renderHeader("Hi " + this.props.currentUser.first_name);
        var text = this.renderText("Are you available for a ride?");
        var statusText = "Customer cannot find you";
        var statusIcon = "not-interested";
        if (is_available) {
            statusText = "Customer can find you";
            statusIcon = "alarm";
        }

        return  (
            <View style={styles.page}>
                <View style={styles.empty_view_riderhome}>
                </View>
                <View style={styles.text_box}>
                    <Avatar/>
                    {header}
                    {text}
                </View>
                <View style={styles.toggle}>
                    <Button
                        action={() => this.toggleAvailability(false)}
                        text={"Not available"}
                        style={styles.primary_button_flex}
                        color={colors.disable}
                        />
                    <Switch
                        style={{borderColor: colors.action}}
                        onTintColor={colors.action}
                        onValueChange={(val) => this.toggleAvailability(val)}
                        value={is_available}
                    />
                    <Button
                        action={() => this.toggleAvailability(true)}
                        text={"Available"}
                        style={styles.primary_button_flex}
                        color={colors.action}
                    />
                </View>
                <View style={styles.avatar_centre_column}>
                    <IconText
                        icon={statusIcon}
                        text={statusText}
                        color={colors.action_secondary}
                        style={{margin: 10}}
                        size ={14}
                        iconSize={26}
                    />
                </View>
                <View style={{alignItems: 'center'}}>
                    <Link
                        style={{padding:10, marginBottom: 10}}
                        action={this.refreshItems}
                        text={'refresh'}
                        icon={'autorenew'}
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
    },
    Title(route, navigator, index, nextState) {
        return (
            <Text style={styles.nav_title}>
                TWENDE
            </Text>
        );
    }
};

module.exports = DriverHomePage;

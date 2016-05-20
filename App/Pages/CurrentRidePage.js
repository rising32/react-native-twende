'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Text,
    Navigator,
    Image,
    TouchableOpacity,
    } = ReactNative;
import MapView from 'react-native-maps';
import {colors, styles} from "../Styles";
import Avatar from "../Components/Avatar";
import { Icon } from 'react-native-material-design';
var CurrentUserStore = require('../Stores/CurrentUserStore');
var GeoLocationStore = require('../Stores/GeoLocationStore');
var RideStore = require('../Stores/RideStore');
var RideActions = require('../Actions/RideActions');
var StepBar = require('../Components/StepBar');
var Link = require('../Components/Link');
var NavIcon = require('../Components/NavIcon');
var NotifyAction = require('../Actions/NotifyActions');

var RequestRidePage = React.createClass({

    cancelRide: function() {
        alert('Ride Cancelled.');
        this.props.navigator.replace({id: 'DriverListPage'});
    },

    componentWillMount: function(props) {
        this.state = {
            origin: null,
            origin_text: '',
            destination: null,
            destination_text: '',
            driver: this.props.driver.id
        };
    },

    refreshLocation: function() {
        this.setState({'origin_text': '- refreshing -'});
        GeoLocationStore.refresh((loc) => {
            var myLoc = Math.round(10000 * loc.latitude)/10000 + ' x ' + Math.round(10000 * loc.longitude)/10000;
            this.setState({
                'origin': {
                    latitude: loc.latitude,
                    logitude: loc.longitude
                },
                'origin_text': myLoc
            });
        });
    },

    togglePickupSearch: function(){
        if (this.state.pickupSearch) {
            this.setState({pickupSearch: false});
        } else {
            this.setState({pickupSearch: true});

        }
    },

    setPickupLocation: function(){
        this.setState({pickupSearch: false})
    },

    componentDidMount: function (props) {
        this.refreshLocation();

        var title = "Driver has accepted";
        var message = `${this.props.driver.name}: I'm on my way...`;
        window.setTimeout(() => {
            NotifyAction.local(title, message);
        }, 5000)
    },

    requestRide: function () {
        RideActions.create(this.state);
    },

    fuzzyDistance: function() {
        let dist = this.props.driver.distance;
        if (dist > 1000) {
            return Math.round(dist / 100) / 10 + 'km';
        }
        return Math.round(dist)  + 'm';
    },

    render: function () {
        return (
            <Navigator
                renderScene={this.renderScene}
                navigator={this.props.navigator}
                cancelRide={this.cancelRide}
                navigationBar={
            <Navigator.NavigationBar style={styles.nav_bar}
                routeMapper={NavigationBarRouteMapper} />
          }/>
        );
    },

    renderScene: function (route, navigator) {
        return (
            <View style={styles.page}>
                <StepBar />
                <View style={styles.sheet_dark}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Avatar image={this.props.currentUser.avatar} />
                        <Text style={{width: 90, textAlign: 'center', marginLeft: 20, marginRight: 20}}>
                            We're connecting you with {this.props.driver.name}
                        </Text>
                        <Avatar image={this.props.driver.avatar} />
                    </View>

                    <View style={{padding: 30}}>
                        <Link style={{margin: 10}}
                              url={"tel:+31654631419"}
                              icon={"phone"}
                              size={16}
                              iconSize={24}
                              color={colors.action}
                              text={"CALL " + this.props.driver.name.toUpperCase()}
                        />
                        <Link style={{margin: 10}}
                              action={this.cancelRide}
                              icon={"clear"}
                              size={16}
                              iconSize={24}
                              color={colors.action_secondary}
                              text={"CANCEL RIDE"}
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
    },
    Title(route, navigator, index, nextState) {
        return (
            <Text style={styles.nav_title}>
                MY RIDE
            </Text>
        );
    }
};

module.exports = RequestRidePage;

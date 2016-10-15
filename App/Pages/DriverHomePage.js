'use strict';

var React = require('react-native');
var {
    Component,
    Alert,
    View,
    Text,
    TextInput,
    Navigator,
    TouchableOpacity,
    } = React;

import {
    MKSwitch,
} from 'react-native-material-kit';


import CustomerStore from '../Stores/CustomerStore';
import CurrentRideStore from '../Stores/CurrentRideStore';
var MapView = require('react-native-maps');
var NavIcon = require('../Components/NavIcon');
var IconText = require('../Components/IconText');
import { Icon } from 'react-native-material-design';
var Avatar = require('../Components/Avatar');
var Link = require('../Components/Link');
var SheetIcon = require('../Components/SheetIcon');
var SheetAvatar = require('../Components/SheetAvatar');
var StarRating = require('../Components/StarRating');
import {colors, styles} from "../Styles";
import events from "../Constants/Events";
import { loadCustomerList } from "../Actions/CustomerActions";
import { updateCurrentRide } from "../Actions/CurrentRideActions";
import { updateCurrentUser } from"../Actions/CurrentUserActions";
import { startWatchingGeoLocation,
         stopWatchingGeoLocation } from "../Actions/GeoLocationActions";


var DriverHomePage = React.createClass({

    getInitialState: function(props) {
        return {
            currentUser: this.props.currentUser,
            currentRide: this.props.currentRide,
            location: {},
            rating: 0,
            price: 0,
            region: {
                latitude: 52.1668,
                longitude: 4.491,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            },
            items: []
        }
    },

    refreshItems: function(){
        loadCustomerList();
    },

    toggleAvailability: function(available) {
        var currentUser = this.state.currentUser;
        currentUser.is_available = available.checked;
        this.setState({currentUser: currentUser});
        updateCurrentUser(currentUser);
    },

    acceptRide: function() {
        var ride = this.state.currentRide;
        ride.state = 'accepted';
        updateCurrentRide(ride);
    },

    startRide: function() {
        var ride = this.state.currentRide;
        ride.state = 'driving';
        updateCurrentRide(ride);
    },

    dropoffRide: function() {
        var ride = this.state.currentRide;
        ride.state = 'dropoff';
        updateCurrentRide(ride);
    },


    rateRide: function (rating) {
        this.setState({rating: rating});
    },

    finishRide: function() {
        Alert.alert(
            'Asante sana',
            'Thanks for using Twende, we hope to see you again soon.',
            [
                {text: 'OK', onPress: () => {}}
            ]
        );
        var ride = this.state.currentRide;
        ride.driver_price = this.state.price;
        ride.driver_rating = this.state.rating;
        ride.state = 'finalized';
        this.setState({currentRide: ride});
        updateCurrentRide(ride);
        this.props.navigator.push({id: 'DriverHomePage'});
    },

    declineRide: function(ride) {
        Alert.alert(
            'Decline ride',
            'Are you sure you want to decline this ride??',
            [
                {text: 'Yes, decline', onPress: () => {
                    ride.state = 'declined';
                    updateCurrentRide(ride);
                }},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
            ])
    },

    setItems: function(items) {

        if (items.length) {
            var currentRide = items[0];
            this.setState({currentRide: currentRide});
            this.setState({region: {
                latitude: currentRide.origin.latitude,
                longitude: currentRide.origin.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }})
        }
    },

    nextStep: function(currentRide) {
        if (currentRide.state in ['declined', 'finalized']) {
            this.setState({currentRide: {}});
        }
        this.setState({currentRide: currentRide});
    },

    componentWillMount: function() {
        startWatchingGeoLocation();
        CustomerStore.on(events.customerListLoaded, this.setItems);
        CurrentRideStore.on(events.currentRideLoaded, this.nextStep);
        this.refreshItems();
    },

    componentWillUnmount: function() {
        //stopWatchingGeoLocation();
        CustomerStore.removeListener(events.customerListLoaded, this.setItems);
        CurrentRideStore.removeListener(events.currentRideLoaded, this.nextStep)
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

    renderSheetTop: function (nextAction, nextIcon) {
        var ride = this.state.currentRide;
        return (
            <View style={{justifyContent: 'space-between', alignSelf: 'stretch', flexDirection: 'row', marginTop: -50, marginBottom: -15, elevation: 5}}>
                <TouchableOpacity onPress={() => this.declineRide(ride)}>
                    <View style={[styles.sheet_icon, {backgroundColor: colors.action_disabled}]}>
                        <Icon
                            name={'clear'}
                            size={30}
                            color={'#ffffff'}
                        />
                    </View>
                </TouchableOpacity>
                <Avatar image={ride.customer.avatar} />
                <TouchableOpacity onPress={() => nextAction(ride)}>
                    <View style={[styles.sheet_icon, {backgroundColor: colors.action}]}>
                        <Icon
                            name={nextIcon}
                            size={30}
                            color={'#ffffff'}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    },

    renderEmpty: function() {
        return  (
            <View style={{alignItems: 'center'}}>
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
        var ride = this.state.currentRide;
        var top = this.renderSheetTop(this.acceptRide, 'check');
        var away = ride.driver_distance.distance + ' (' + ride.driver_distance.duration + ') away.';
        return  (
            <View>
                <View style={styles.map}>
                    <MapView
                        region={this.state.region}
                        showsUserLocation={true}
                        style={{height:300, borderWidth:4, borderColor:'#FFFF00'}}
                    >
                        <MapView.Marker
                            coordinate={this.state.currentRide.origin}
                        />
                    </MapView>
                </View>
                <View style={[styles.sheet, {flex: 1}]}>
                    {top}
                    <View style={styles.sheet_content}>
                        <Text style={styles.item_title}>
                            {ride.customer.name}
                        </Text>
                        <Text>
                            You got a new request! Push confirm button and you're ready to pick up {ride.customer.name}.
                        </Text>
                        <IconText
                            icon={"motorcycle"}
                            text={away}
                            color={colors.action_secondary}
                            style={{margin: 10}}
                        />
                    </View>
                </View>
            </View>
        );
    },

    renderAccepted: function() {
        var ride = this.state.currentRide;
        var top = this.renderSheetTop(this.startRide, 'group');
        return  (
            <View>
                <View style={styles.map}>
                    <MapView
                        region={this.state.region}
                        showsUserLocation={true}
                        style={{height:300, borderWidth:4, borderColor:'#FFFF00'}}
                    >
                        <MapView.Marker
                            coordinate={this.state.currentRide.origin}
                        />
                    </MapView>
                </View>
                <View style={[styles.sheet, {flex: 1}]}>
                    {top}
                    <View style={styles.sheet_content}>
                        <Text style={styles.item_title}>
                            You've accepted the ride. {ride.customer.name} is waiting.
                        </Text>
                        <Text>
                            If you arrived at the customer click the next button and you are on your way!
                        </Text>
                        <Link
                            icon={"pin-drop"}
                            url={"geo:?q=" + ride.origin.latitude + ","  + ride.origin.longitude}
                            text={'start navigation'.toUpperCase()}
                            color={colors.action}
                            size={16}
                            iconSize={24}
                            style={{margin: 10}}
                        />
                        <Link style={{margin: 10}}
                              url={"tel: " + ride.customer.phone}
                              icon={"phone"}
                              size={16}
                              iconSize={24}
                              color={colors.action}
                              text={"CALL " + ride.customer.name.toUpperCase()}
                        />

                    </View>
                </View>
            </View>
        );

    },

    renderDriving: function() {
        var ride = this.state.currentRide;
        var top = this.renderSheetTop(this.dropoffRide, 'beenhere');
        return  (
            <View>
                <View style={styles.map}>
                    <MapView
                        region={this.state.region}
                        showsUserLocation={true}
                        style={{height:300, borderWidth:4, borderColor:'#FFFF00'}}
                    >
                        <MapView.Marker
                            coordinate={this.state.currentRide.origin}
                        />
                    </MapView>
                </View>
                <View style={[styles.sheet, {flex: 1}]}>
                    {top}
                    <View style={styles.sheet_content}>
                        <Text style={styles.item_title}>
                            Ok, you're on your way.
                        </Text>
                        <Text>
                            If you arrive at the destination, hit the next button to complete this ride!
                        </Text>
                    </View>
                </View>
            </View>
        );

    },

    renderDropoff: function() {
        var ride = this.state.currentRide;
        var top = this.renderSheetTop(this.finishRide, 'tag-faces');
        return  (
            <View>
                <View style={{height: 100, backgroundColor: '#888888'}}>
                </View>
                <View style={[styles.sheet, {flex: 1}]}>
                    {top}
                    <View style={styles.sheet_content}>
                        <View style={styles.card_mid}>
                            <Text style={styles.item_title}>
                                Rate this ride.
                            </Text>
                            <Text>
                                How was your ride with {ride.customer.name}?
                            </Text>
                            <StarRating
                                onChange={this.rateRide}
                                maxStars={5}
                                rating={0}
                                colorOn={colors.action}
                                colorOff={colors.action_disabled}
                            />
                            <Text style={{marginTop: 10}}>How much did you get paid for this ride?</Text>
                            <TextInput
                                placeholder={"0"}
                                autoCorrect={false}
                                onChangeText={(price) => this.setState({price: price})}
                                style={{borderColor: 'gray', borderWidth: 1, flex: 1, color: colors.action_secondary}}
                            />
                            <Link
                                action={() => this.finishRide()}
                                style={styles.button_simple}
                                text={"FINISH"}
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
        var content = this.renderEmpty();
        if (this.state.currentUser.is_available) {
            if (this.state.currentRide) {
                switch (this.state.currentRide.state) {
                    case 'requested' :
                        content = this.renderRequest();
                        break;
                    case 'accepted' :
                        content = this.renderAccepted();
                        break;
                    case 'driving' :
                        content = this.renderDriving();
                        break;
                    case 'dropoff' :
                        content = this.renderDropoff();
                        break;
                }
            }
        } else {
            content = this.renderUnavailable();
        }

        return (
            <View style={styles.page}>
                {content}
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

module.exports = DriverHomePage;

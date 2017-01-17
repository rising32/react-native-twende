'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Alert,
    View,
    Text,
    TextInput,
    Navigator,
    ToastAndroid,
    } = ReactNative;
import {colors, styles} from "../Styles";
import Avatar from "../Components/Avatar";
import { Icon } from 'react-native-material-design';
var IconText = require('../Components/IconText');
var Iconed = require('../Components/Iconed');
var StepBar = require('../Components/StepBar');
var Map = require('../Components/Map');
var Link = require('../Components/Link');
var StarRating = require('../Components/StarRating');
var NavIcon = require('../Components/NavIcon');
import CurrentRideStore from '../Stores/CurrentRideStore';
import {
    createCurrentRide,
    refreshCurrentRide,
    updateCurrentRide } from "../Actions/CurrentRideActions";
import events from "../Constants/Events";

var SheetIcon = require('../Components/SheetIcon');


var CurrentRidePage = React.createClass({

    getInitialState: function () {
        return {
            currentUser: this.props.currentUser,
            currentRide: this.props.currentRide,
            isLoading: false,
            price: 0,
            rating: 0
        }

    },

    cancelRide: function () {
        ToastAndroid.show('Ride canceled.', ToastAndroid.LONG);
        var currentRide = this.props.currentRide;
        currentRide.state = 'canceled';
        updateCurrentRide(currentRide);
    },

    findNewDriver: function() {
        // This ride is rejected so create a new one.
        var rejectedRide = this.props.currentRide;
        var ride = {
            origin:      rejectedRide.origin,
            origin_text: rejectedRide.origin_text,
            status: 'new'
        };
        createCurrentRide(ride);
    },

    refreshRide: function () {
        refreshCurrentRide(this.props.currentRide.id);
        ToastAndroid.show('Refreshing...', ToastAndroid.SHORT)
    },

    rideLoaded: function (currentRide) {
        if (currentRide.state == 'declined') {
            Alert.alert(
                'Rider busy',
                'So sorry, but ' + currentRide.driver.first_name + ' declined your request.\n' +
                    'Please try one of the other riders.'
                ,
                [
                    {text: 'OK', onPress: () => {
                        this.props.navigator.push({id: 'CurrentLocationPage'});
                    }}
                ]
            );
        }
        if (currentRide.state == undefined || currentRide.state == 'canceled') {
            this.props.navigator.push({id: 'CurrentLocationPage'});
        }
        this.setState({currentRide: currentRide});
    },

    fuzzyDistance: function () {
        let dist = this.props.currentRide.driver.distance;
        if (dist > 1000) {
            return Math.round(dist / 100) / 10 + 'km';
        }
        return Math.round(dist) + 'm';
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
        var ride = this.props.currentRide;
        ride.customer_price = this.state.price;
        ride.customer_rating = this.state.rating;
        ride.state = 'finalized';
        this.setState({currentRide: ride});
        updateCurrentRide(ride);
        this.props.navigator.push({id: 'CurrentLocationPage'});
    },

    moreInfoRating: function() {
        alert("We'll keep your rating anonymous. It's only so users can see which riders have the best rating.")
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

    renderConnecting: function () {
        var steps = [
            {in_progress: true, done: false, title: 'Ride requested'},
            {in_progress: false, done: false, title: 'Rider on his way'},
            {in_progress: false, done: false, title: 'En route'}
        ];
        var ride = this.props.currentRide;
        var user = this.props.currentRide;

        return (
            <View style={{flex: 1}}>
                <Map
                    title= {"Connecting..."}
                    driver={ride.driver.position}
                    customer={ride.origin}
                />
                <View style={styles.sheet_dark}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Avatar image={user.avatar}/>
                        <Text style={{width: 90, textAlign: 'center', marginLeft: 20, marginRight: 20}}>
                            We're connecting you with {rider.driver.name}
                        </Text>
                        <Avatar image={ride.driver.avatar} />
                    </View>

                    <View style={{padding: 10, paddingTop: 30}}>
                        <Link style={{margin: 10}}
                              url={"tel: " + ride.driver.phone}
                              icon={"phone"}
                              size={16}
                              iconSize={24}
                              color={colors.action}
                              text={"CALL " + ride.driver.name.toUpperCase()}
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
        )
    },

    renderDeclined: function () {
        var steps = [
            {in_progress: false, done: false, title: 'Request declined'},
            {in_progress: false, done: false, title: 'Rider on his way'},
            {in_progress: false, done: false, title: 'En route'}
        ];
        return (
            <View style={{flex: 1}}>
                <View style={styles.sheet_dark}>
                    <View style={{alignItems: 'center'}}>
                        <View style={styles.card_mid}>
                            <Text style={{textAlign: 'center'}}>
                                Your request has been declined.
                            </Text>

                        </View>
                    </View>
                    <Link style={{margin: 10}}
                          action={this.findNewDriver}
                          icon={"motorcycle"}
                          size={16}
                          iconSize={24}
                          color={colors.action_secondary}
                          text={"FIND ANOTHER RIDER"}
                    />
                </View>
            </View>
        )
    },
    renderAccepted: function () {
        var steps = [
            {in_progress: true, done: true, title: 'Ride accepted'},
            {in_progress: true, done: false, title: 'Rider on his way'},
            {in_progress: false, done: false, title: 'En route'}
        ];
        var ride = this.props.currentRide;
        var user = this.props.currentUser
        var away = "Rider is on his way..."
        //var away = ride.driver_distance.distance + ' (' + ride.driver_distance.duration + ') away.';
        return (
            <View style={{flex: 1}}>
                <Map
                    title={"rider on his way"}
                    driver={ride.driver.position}
                    customer={ride.origin}
                />
                <View style={styles.sheet_dark}>
                    <View style={{alignItems: 'center'}}>
                        <View style={styles.card_mid_spacer}/>
                        <View style={styles.card_mid_avatar}>
                            <Avatar
                                image={ride.driver.avatar}/>
                        </View>
                        <View style={styles.card_mid}>
                            <Text style={styles.item_title}>
                                Hi {user.first_name},
                            </Text>
                            <Text>
                                I accepted your request.
                            </Text>
                            <Link style={{margin: 10}}
                                  url={"tel: " + ride.driver.phone}
                                  icon={"phone"}
                                  size={16}
                                  iconSize={24}
                                  color={colors.action}
                                  text={"CALL " + ride.driver.name.toUpperCase()}
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
                        <IconText
                            icon={"motorcycle"}
                            text={away}
                            color={colors.action_secondary}
                            style={{margin: 10}}
                        />

                    </View>
                </View>
            </View>
        )
    },

    renderDriving: function () {
        var steps = [
            {in_progress: true, done: true, title: 'Ride accepted'},
            {in_progress: true, done: true, title: 'Rider arrived'},
            {in_progress: true, done: false, title: 'En route'}
        ];
        var ride = this.props.currentRide;
        var user = this.props.user
        return (
            <View style={{flex: 1}}>
                <Map
                    style={{flex: 1}}
                    driver={ride.driver.position}
                    customer={ride.origin}
                />
                <View style={styles.sheet_dark}>
                    <View style={{alignItems: 'center'}}>
                        <View style={styles.card_mid_spacer}/>
                        <View style={styles.card_mid_avatar}>
                            <Avatar
                                image={ride.driver.avatar}/>
                        </View>
                        <View style={styles.card_mid}>
                            <Text style={styles.item_title}>
                                Let's go!
                            </Text>
                            <Text>
                                Driver has arrived and you are on your way now.
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    },

    renderDropOff: function () {
        var steps = [
            {in_progress: true, done: true, title: 'Ride accepted'},
            {in_progress: true, done: true, title: 'Rider arrived'},
            {in_progress: true, done: true, title: 'Finished'}
        ];
        var ride = this.props.currentRide;
        var user = this.props.currentUser

        return (
            <View style={{flex: 1}}>
                <View style={styles.sheet_dark}>
                    <View style={{alignItems: 'center'}}>
                        <View style={styles.card_mid_spacer}/>
                        <View style={styles.card_mid_avatar}>
                            <Avatar
                                image={ride.driver.avatar}/>
                        </View>
                        <View style={styles.card_mid}>
                            <Text style={styles.item_title}>
                                Rate this ride.
                            </Text>
                            <Text>
                                How was your ride with {ride.driver.name}?
                            </Text>
                            <StarRating
                                onChange={this.rateRide}
                                maxStars={5}
                                rating={0}
                                colorOn={colors.action}
                                colorOff={colors.action_disabled}
                            />
                            <Text style={{marginTop: 10}}>How much did you pay for this ride?</Text>
                            <TextInput
                                placeholder={"0"}
                                autoCorrect={false}
                                onChangeText={(price) => this.setState({price: price})}
                                style={styles.card_input}
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
        )
    },

    renderDone: function () {
        var steps = [
            {in_progress: false, done: false, title: 'Request declined'},
            {in_progress: false, done: false, title: 'Rider on his way'},
            {in_progress: false, done: false, title: 'En route'}
        ];
        return (
            <View style={{flex: 1}}>
                <View style={styles.sheet_dark}>
                    <View style={{alignItems: 'center'}}>
                        <View style={styles.card_mid}>
                            <Text style={{textAlign: 'center'}}>
                                Sorry, your request has been declined.
                            </Text>
                        </View>
                    </View>
                    <Link style={{margin: 10}}
                          action={this.findNewDriver}
                          icon={"motorcycle"}
                          size={16}
                          iconSize={24}
                          color={colors.action_secondary}
                          text={"FIND ANOTHER RIDER"}
                    />
                </View>
            </View>
        )
    },

    renderScene: function (route, navigator) {
        var content;
        switch (this.props.currentRide.state) {
            case 'accepted':
                content = this.renderAccepted();
                break;
            case 'driving':
                content = this.renderDriving();
                break;
            case 'dropoff':
                content = this.renderDropOff();
                break;
            case 'requested':
                content = this.renderConnecting();
                break;
            case 'new':
                content = this.renderConnecting();
                break;
            default:
                content = this.renderDone();
                break;
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
        return null;
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

module.exports = CurrentRidePage;

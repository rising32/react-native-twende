'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Text,
    Navigator,
    Image,
    ToastAndroid,
    TouchableOpacity,
    TouchableHighlight,
    } = ReactNative;
import {colors, styles} from "../Styles";
import Avatar from "../Components/Avatar";
import { Icon } from 'react-native-material-design';
var StepBar = require('../Components/StepBar');
var Link = require('../Components/Link');
var StarRating = require('../Components/StarRating');
var NavIcon = require('../Components/NavIcon');
import CurrentRideStore from '../Stores/CurrentRideStore';
import {
    refreshCurrentRide,
    updateCurrentRide } from "../Actions/CurrentRideActions";
import events from "../Constants/Events";

var SheetIcon = require('../Components/SheetIcon');


var CurrentRidePage = React.createClass({

    getInitialState: function () {
        return {
            currentUser: this.props.currentUser,
            currentRide: this.props.currentRide,
            driver: this.props.driver
        }

    },
    componentDidMount: function (props) {
        CurrentRideStore.removeAllListeners();
        CurrentRideStore.on(events.currentRideLoaded, this.rideLoaded);
        refreshCurrentRide(this.state.currentRide.id);
    },

    componentWillUnmount: function (props) {
        CurrentRideStore.removeListener(events.currentRideLoaded, this.rideLoaded);
    },

    cancelRide: function () {
        ToastAndroid.show('Ride canceled.', ToastAndroid.LONG);
        var currentRide = this.state.currentRide;
        currentRide.state = 'canceled';
        updateCurrentRide(currentRide);
        this.props.navigator.pop();
    },

    refreshRide: function () {
        refreshCurrentRide(this.state.currentRide);
    },

    rideLoaded: function (currentRide) {
        this.setState({currentRide: currentRide});
    },

    fuzzyDistance: function () {
        let dist = this.state.driver.distance;
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
            {in_progress: false, done: false, title: 'Driver on his way'},
            {in_progress: false, done: false, title: 'En route'}
        ];
        return (
            <View style={{flex: 1}}>
                <StepBar steps={steps}/>
                <View style={styles.sheet_dark}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Avatar image={this.props.currentUser.avatar}/>
                        <Text style={{width: 90, textAlign: 'center', marginLeft: 20, marginRight: 20}}>
                            We're connecting you with {this.state.driver.name}
                        </Text>
                        <Avatar image={this.state.driver.avatar}/>
                    </View>

                    <View style={{padding: 30}}>
                        <Link style={{margin: 10}}
                              url={"tel: " + this.state.driver.phone}
                              icon={"phone"}
                              size={16}
                              iconSize={24}
                              color={colors.action}
                              text={"CALL " + this.state.driver.name.toUpperCase()}
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
            {in_progress: false, done: false, title: 'Driver on his way'},
            {in_progress: false, done: false, title: 'En route'}
        ];
        return (
            <View style={{flex: 1}}>
                <StepBar steps={steps}/>

                <View style={styles.sheet_dark}>
                    <View style={{alignItems: 'center'}}>
                        <View style={styles.card_mid_spacer}/>
                        <View style={styles.card_mid_avatar}>
                            <Avatar
                                image={this.state.driver.avatar}/>
                        </View>
                        <View style={styles.card_mid}>
                            <Text style={{textAlign: 'center'}}>
                                Sorry {this.state.currentUser.first_name},
                            </Text>
                            <Text style={{textAlign: 'center'}}>
                                I declined your request.
                            </Text>
                        </View>
                    </View>
                    <Link style={{margin: 10}}
                          action={this.navigator.pop()}
                          icon={"motorcycle"}
                          size={16}
                          iconSize={24}
                          color={colors.action_secondary}
                          text={"FIND ANOTHER DRIVER"}
                    />

                </View>
            </View>
        )
    },
    renderAccepted: function () {
        var steps = [
            {in_progress: true, done: true, title: 'Ride accepted'},
            {in_progress: true, done: false, title: 'Driver on his way'},
            {in_progress: false, done: false, title: 'En route'}
        ];
        return (
            <View style={{flex: 1}}>
                <StepBar steps={steps}/>
                <View style={styles.sheet_dark}>
                    <View style={{alignItems: 'center'}}>
                        <View style={styles.card_mid_spacer}/>
                        <View style={styles.card_mid_avatar}>
                            <Avatar
                                image={this.state.driver.avatar}/>
                        </View>
                        <View style={styles.card_mid}>
                            <Text style={{textAlign: 'center'}}>
                                Hi {this.state.currentUser.first_name},
                            </Text>
                            <Text style={{textAlign: 'center'}}>
                                I accepted your request.
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    },

    renderDriving: function () {
        var steps = [
            {in_progress: true, done: true, title: 'Ride accepted'},
            {in_progress: true, done: true, title: 'Driver arrived'},
            {in_progress: true, done: false, title: 'En route'}
        ];
        return (
            <View style={{flex: 1}}>
                <StepBar steps={steps}/>
                <View style={styles.sheet_dark}>
                    <View style={{alignItems: 'center'}}>
                        <View style={styles.card_mid_spacer}/>
                        <View style={styles.card_mid_avatar}>
                            <Avatar
                                image={this.state.driver.avatar}/>
                        </View>
                        <View style={styles.card_mid}>
                            <Text style={{textAlign: 'center'}}>
                                Let's go!
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    },

    rateRide: function (value) {
        ToastAndroid.show(`You rated this ride with ${value} stars.`, ToastAndroid.SHORT);
        var ride = this.state.currentRide;
        ride.customer_rating = value;
        this.setState({currentRide: ride});
        updateCurrentRide(ride);
    },

    renderDropOff: function () {
        var steps = [
            {in_progress: true, done: true, title: 'Ride accepted'},
            {in_progress: true, done: true, title: 'Driver arrived'},
            {in_progress: true, done: true, title: 'Finished'}
        ];
        return (
            <View style={{flex: 1}}>
                <StepBar steps={steps}/>
                <View style={styles.sheet_dark}>
                    <View style={{alignItems: 'center'}}>
                        <View style={styles.card_mid_spacer}/>
                        <View style={styles.card_mid_avatar}>
                            <Avatar
                                image={this.state.driver.avatar}/>
                        </View>
                        <View style={styles.card_mid}>
                            <Text style={{textAlign: 'center'}}>
                                Rate this ride.
                            </Text>
                            <Text style={{textAlign: 'center'}}>
                                How was your ride with {this.props.driver.name}?
                            </Text>
                            <StarRating
                                onChange={this.rateRide}
                                maxStars={5}
                                rating={3}
                                colorOn={colors.action}
                                colorOff={colors.action_disabled}
                            />

                            <View style={styles.card_mid_actions}>
                                <Link
                                    action={() => this.finishRide()}
                                    style={styles.button_simple}
                                    text={"DON'T RATE"}
                                    textStyle={{fontWeight: 'bold'}}
                                    color={colors.action_secondary}
                                    />
                                <Link
                                    action={() => this.finishRide()}
                                    style={styles.button_simple}
                                    text={"SAVE RATING"}
                                    textStyle={{fontWeight: 'bold'}}
                                    color={colors.action}
                                    />
                            </View>

                        </View>
                    </View>

                </View>
            </View>
        )
    },


    renderDone: function () {
        return (
            <View style={{flex: 1}}>
            </View>
        )
    },


    renderScene: function (route, navigator) {
        var content;
        switch (this.state.currentRide.state) {
            case 'accepted':
                content = this.renderAccepted();
                break;
            case 'driving':
                content = this.renderDriving();
                break;
            case 'dropoff':
                content = this.renderDropOff();
                break;
            case 'declined':
                content = this.renderDeclined();
                break;
            default:
                content = this.renderConnecting();
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

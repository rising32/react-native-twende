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
var Button = require('../Components/Button');
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
        ride.customer_rating = this.state.rating;
        ride.state = 'finalized';
        this.setState({currentRide: ride});
        updateCurrentRide(ride);
        this.props.navigator.push({id: 'CurrentLocationPage'});
    },

    moreInfoRating: function() {
        alert("We'll keep your rating anonymous. It's only so users can see which riders have the best rating.")
    },

    payMpesa: function(){
        var ride = this.props.currentRide;
        ride.customer_price = this.state.price;
        ride.customer_rating = this.state.rating;
        ride.state = 'payment';
        ride.payment_method = 'mpesa';
        this.setState({currentRide: ride});
        updateCurrentRide(ride);
    },

    payCash: function(){
        var ride = this.props.currentRide;
        ride.customer_price = this.state.price;
        ride.customer_rating = this.state.rating;
        ride.state = 'payment';
        ride.payment_method = 'cash';
        this.setState({currentRide: ride});
        updateCurrentRide(ride);
    },

    completePayment: function(){
        var ride = this.props.currentRide;
        ride.customer_price = this.state.price;
        ride.customer_rating = this.state.rating;
        ride.state = 'finalized';
        this.setState({currentRide: ride});
        updateCurrentRide(ride);
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
        var ride = this.props.currentRide;
                var away = "Rider is on his way...";
        if (ride.driver_distance) {
            away = ride.driver_distance.distance + ' (' + ride.driver_distance.duration + ') away';
        }
        return (
            <View style={{flex: 1}}>
                <Map
                    title= {"Connecting..."}
                    driver={ride.driver.position}
                    customer={ride.origin}
                />
                <View style={styles.sheet_dark}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Avatar image={ride.customer.avatar}/>
                        <Text style={{width: 90, textAlign: 'center', marginLeft: 18, marginRight: 18, fontSize: 12, color: '#1da69a'}}>
                            Connecting... Wait for call of {ride.driver.name} or call with button below
                        </Text>
                        <Avatar image={ride.driver.avatar} />
                    </View>
                    <View style={{padding: 10, paddingTop: 10}}>
                        <Link style={{margin: 10}}
                              url={"tel: " + ride.driver.phone}
                              icon={"phone"}
                              size={16}
                              iconSize={24}
                              color={colors.secondary}
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
                        color={colors.secondary}
                        style={{padding: 6, margin: 14}}
                    />
                </View>
            </View>
        )
    },

    renderDeclined: function () {
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
                          text={"PLEASE SELECT ANOTHER RIDER"}
                    />
                </View>
            </View>
        )
    },
    renderAccepted: function () {
        var ride = this.props.currentRide;
        var away = "Rider is on his way...";
        if (ride.driver_distance) {
            away = ride.driver_distance.distance + ' (' + ride.driver_distance.duration + ') away';
        }
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
                                Hi {ride.customer.first_name},
                            </Text>
                            <Text>
                                I'm on my way to pick you up!
                            </Text>
                            <Link style={{margin: 0, padding: 10}}
                                  url={"tel: " + ride.driver.phone}
                                  icon={"phone"}
                                  size={16}
                                  iconSize={24}
                                  color={colors.action}
                                  text={"CALL " + ride.driver.name.toUpperCase()}
                            />
                            <Link style={{margin: 0, padding: 10}}
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
            </View>
        )
    },

    renderDriving: function () {
        var ride = this.props.currentRide;
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
                                Your are on your way now. 
                            </Text>
                            <Text>
                                Enjoy the ride! 
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    },

    renderDropOff: function () {
        var ride = this.props.currentRide;
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
                                Payment
                            </Text>
                            <Text style={styles.heavy_text}>
                                {ride.fare}
                            </Text>
                            <Text>
                                Your trip was {ride.distance.distance}.
                            </Text>
                            <View style={{flexDirection: 'row'}}>
                                <Button
                                    action={this.payMpesa}
                                    text={"M-PESA"}
                                    color={colors.action}
                                    />
                                <Button
                                    action={this.payCash}
                                    text={"CASH"}
                                    color={colors.action}
                                    />
                            </View>
                        </View>
                    </View>

                </View>
            </View>
        )
    },

    renderPayment: function () {
        var ride = this.props.currentRide;
        var phone;
        if (ride.payment_method == 'mpesa') {
            phone = (
                <View>
                    <Text style={{textAlign: 'center'}}>
                        You can send the money to:
                    </Text>
                    <Text style={styles.heavy_text}>
                        {ride.driver.phone}
                    </Text>

                </View>
            );
        }

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
                            {ride.payment_method.toUpperCase()} PAYMENT
                            </Text>
                            <Text style={styles.heavy_text}>
                                {ride.fare}
                            </Text>
                            {phone}
                            <View style={{flexDirection: 'row'}}>
                                <Button
                                    action={this.completePayment}
                                    text={"DONE"}
                                    color={colors.action}
                                    />
                            </View>
                        </View>
                    </View>

                </View>
            </View>
        )
    },

    renderFinalize: function () {
        var ride = this.props.currentRide;
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
                            <View style={{flexDirection: 'row'}}>
                                <Button
                                    action={this.finishRide}
                                    text={"FINISH"}
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
            case 'declined':
                content = this.renderDeclined();
                break;
            case 'driving':
                content = this.renderDriving();
                break;
            case 'dropoff':
                content = this.renderDropOff();
                break;
            case 'payment':
                content = this.renderPayment();
                break;
            case 'finalized':
                content = this.renderFinalize();
                break;
            case 'requested':
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
                ON YOUR WAY
            </Text>
        );
    }
};

module.exports = CurrentRidePage;

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
import {colors, styles} from "../Styles";
import events from "../Constants/Events";
import { updateCurrentRide,
         loadRideList,
         loadCurrentRide } from "../Actions/CurrentRideActions";
import { reloadCurrentUser } from"../Actions/CurrentUserActions";
import { startWatchingGeoLocation,
         loadGeoLocation,
         stopWatchingGeoLocation } from "../Actions/GeoLocationActions";
import Timer from '../Components/Timer';
import TimerMixin from 'react-timer-mixin';
const timer = require('react-native-timer');


module.exports = React.createClass({

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
        this, 'hideMessage', () => this.setState({showMessage: false}), 60000
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

    acceptRide: function() {
        var ride = this.props.currentRide;
        ride.state = 'accepted';
        updateCurrentRide(ride);
        Alert.alert(
            'Reminder',
            'Remember to give ' + ride.customer.first_name + ' a call to confirm that you are coming.',
            [
                {text: 'OKAY!', onPress: () => {}}
            ]
        );
    },

    startRide: function() {
        var ride = this.props.currentRide;
        ride.state = 'driving';
        updateCurrentRide(ride);
    },

    openNavigation: function() {
        let url = "geo:?q=" + this.props.currentRide.origin.latitude + ","  + this.props.currentRide.origin.longitude;
        Linking.openURL(url);
    },

    dropoffRide: function() {
        var ride = this.props.currentRide;
        ride.state = 'dropoff';
        updateCurrentRide(ride);
    },

    rateRide: function (rating) {
        this.setState({rating: rating});
    },

    choosePayment: function(){
        var ride = this.props.currentRide;
        ride.driver_price = this.state.price;
        ride.driver_rating = this.state.rating;
        ride.state = 'payment';
        ride.payment_method = 'cash';
        this.setState({currentRide: ride});
        updateCurrentRide(ride);
    },

    completePayment: function(){
        var ride = this.props.currentRide;
        ride.driver_price = this.state.price;
        ride.driver_rating = this.state.rating;
        ride.state = 'finalized';
        this.setState({currentRide: ride});
        updateCurrentRide(ride);
    },

    finishRide: function() {
        var ride = this.props.currentRide;
        ride.driver_price = this.state.price;
        ride.driver_rating = this.state.rating;
        ride.state = 'finalized';

        updateCurrentRide(ride);

        // Reload currentUser to get new user state
        reloadCurrentUser();
    },

    declineRide: function(ride) {
        var ride = this.props.currentRide;
        Alert.alert(
            'Decline ride',
            'Are you sure you want to decline this ride??',
            [
                {
                    text: 'Yes, decline',
                    onPress: () => {
                        ride.state = 'declined';
                        this.state.currentUser.state = 'unavailable';
                        updateCurrentRide(ride);
                    }
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ])
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

    renderSheetTop: function (renderRoute=true) {
        const ride = this.props.currentRide;
        return (
            <View style={styles.sheet_top}>
                <View style={styles.renderItemLeft}>
                    {renderRoute ?
                        <SheetIcon
                            action={this.openNavigation}
                            name={'motorcycle'}
                            text={'ROUTE'}
                            size={20}
                            text_color={colors.secondary}
                            align={'flex-start'}
                            fontSize={13}
                            color={colors.white}
                            width={27}
                            height={27}
                            backgroundColor={colors.secondary}
                        /> : <Text />
                    }
                </View>
                <Avatar image={ride.customer.avatar}/>
                <View style={styles.renderItemRight}>
                    <SheetIcon
                        action={this.declineRide}
                        size={20}
                        right={true}
                        fontSize={13}
                        text_color={colors.disable}
                        name={'clear'}
                        text={'DECLINE'}
                        backgroundColor={colors.disable}
                        color={colors.white}
                        width={27}
                        height={27}
                    />
                </View>
            </View>
        );
    },

    renderHeader: function (header) {
        return (
        <Text style={styles.item_title}>
            {header}
        </Text>
        )
    },

    renderCustomer: function (customer) {
        return (
            <Text style={styles.customer_title}>
                {customer}
            </Text>
        )
    },

    renderTextRide: function (text) {
        return (
            <Text style={styles.text_ride}>
                {text}
            </Text>
        )
    },

    renderDistance: function (distance) {
        return (
            <Text style={styles.text}>
                {distance}
            </Text>
        )
    },

    renderRequest: function() {
        var ride = this.props.currentRide;

        // components in screen
        var top = this.renderSheetTop(false);
        var header = this.renderHeader("Incoming Request");
        var customer = this.renderCustomer(ride.customer.name);

        return  (
            <View style={styles.page_ride}>
                <View style={styles.map_container}>
                    <Map
                        title={"request"}
                        driver={ride.driver.position}
                        customer={ride.origin}
                    />
                </View>
                {top}
                 {this.state.showMessage ? (
                <View>
                    <View style={styles.text_box}>
                        {customer}
                        <Rating
                            maxStars={5}
                            showNumber={false}
                            color={colors.grey}
                            rating={ride.customer.rating}
                            colorOn={colors.rating}
                            colorOff={colors.action_disabled}
                            size={20}
                            style={styles.item}
                        />
                        <Text style={styles.text_timer}>
                            {ride.driver_distance.distance} away
                        </Text>
                        <View style={styles.countdown_timer_container}>
                            <Timer 
                                ms={600000} 
                                style={styles.countdown_timer_view}
                                textStyle={styles.countdown_timer}
                            />
                        </View>
                    </View>
                    <Button
                        action={this.acceptRide}
                        text={"ACCEPT REQUEST"}
                        color={colors.action}
                    />
                </View>
                ) : (
                <View>
                    <View style={styles.text_box}>
                        {customer}
                        <Rating
                            maxStars={5}
                            showNumber={false}
                            color={colors.grey}
                            rating={ride.customer.rating}
                            colorOn={colors.rating}
                            colorOff={colors.action_disabled}
                            size={20}
                            style={styles.item}
                        />
                        <Text style={styles.text_important}>
                            {ride.driver_distance.distance} away
                        </Text>
                        <Text style={styles.countdown_timer_text}>
                            You did not respond in time. The request will be cancelled soon.
                        </Text>
                        <View style={styles.timer}>
                        </View>
                    </View>
                    <Button
                        action={this.acceptRide}
                        text={"ACCEPT REQUEST"}
                        color={colors.action}
                    />
                </View>
                )}  
            </View>
        );
    },

    renderAccepted: function() {
        var ride = this.props.currentRide;

        // components in screen
        var top = this.renderSheetTop();
        var header =this.renderHeader("Hi " + ride.driver.first_name + ",");
        var text = this.renderTextRide("First give me a call. Then pick me up. Press the 'Twende' button when we start the trip!");

        return  (
            <View style={styles.page_ride}>
                <View style={styles.map_container}>
                    <Map
                        title={"on your way"}
                        driver={ride.driver.position}
                        customer={ride.origin}
                    />
                </View>
                {top}
                <View style={styles.text_box}>
                    {header}
                    {text}
                    <SheetIcon
                        url={"tel: " + ride.customer.phone}
                        name={'phone'}
                        backgroundColor={colors.secondary}
                        width={30}
                        height={30}
                        color={colors.white}
                        size={22}
                        text_color={colors.secondary}
                        text={" CALL " + ride.customer.name.toUpperCase()}
                    />
                </View>
                <Button
                    action={this.startRide}
                    text={"TWENDE!"}
                    color={colors.action}
                    />
            </View>
        );
    },

    renderDriving: function() {
        var ride = this.props.currentRide;

        // components in screen
        var top = this.renderSheetTop();
        var header = this.renderHeader("Hi " + ride.driver.first_name + ",");
        var text = this.renderTextRide("Please offer me a helmet & hair net. Ride carefully!");

        return  (
            <View style={styles.page_ride}>
                <View style={styles.map_container}>
                    <Map
                        title={"on your way"}
                        driver={ride.driver.position}
                        customer={ride.origin}
                    />
                </View>
                {top}
                <View style={styles.text_box}>
                    {header}
                    {text}
                    <SheetIcon
                        name={'phone'}
                        backgroundColor={colors.secondary}
                        width={30}
                        height={30}
                        color={colors.white}
                        size={22}
                        text_color={colors.secondary}
                        url={"tel: 0791398120"}
                        text={" CALL SUPPORT"}
                    />
                </View>
                <Button
                    action={this.dropoffRide}
                    text={"FINISH RIDE"}
                    color={colors.action}
                    />
            </View>
        );
    },

    renderDropOff: function() {
        var ride = this.props.currentRide;

        // screen components
        var header = this.renderHeader("Ride Fare");
        var distance = this.renderDistance("The trip was " + ride.distance.distance);
        var commission = this.props.currentRide.ride_fare.amount * 0.2;

        return  (
            <View style={styles.page_finalize}>
                <View></View>
                <View style={styles.text_box}>
                    <Avatar />
                    {header}
                    {distance}
                    <Text style={styles.heavy_text}>
                        {ride.fare}
                    </Text>
                     <Text style={styles.text}>
                        Commission (20%): {commission} KES
                    </Text>
                    <Line/>
                    <Text style={styles.text_finalize}>
                        Request for payment from {ride.customer.name}
                    </Text>
                    <Button
                        action={this.choosePayment}
                        style={styles.primary_button_finalize}
                        text={"NEXT"}
                    />
                </View>
                <Banner/>
            </View>
        );
    },

    renderPayment: function() {
        var ride = this.props.currentRide;

        // screen components
        var header = this.renderHeader("Payment");

        return  (
            <View style={styles.page_finalize}>
                <View></View>
                <View style={styles.text_box}>
                    <Avatar />
                    {header}
                    <Text style={styles.heavy_text}>
                        {ride.fare}
                    </Text>
                    <Text style={styles.text}>
                        Confirm payment by {ride.customer.name}
                    </Text>
                    <Line/>
                    <Text style={styles.text}>
                        M-Pesa Payment: Choose Paybill Number: 653839. Account No: Ride
                    </Text>
                    <Button
                        action={this.completePayment}
                        style={styles.primary_button_finalize}
                        text={"CONFIRM PAYMENT"}
                    />
                </View>
                <Banner/>
            </View>
        );
    },

    renderFinalize: function() {
        var ride = this.props.currentRide;

        // screen components
        var header = this.renderHeader("Rating");

        return  (
            <View style={styles.page_finalize}>
                <View></View>
                <View style={styles.text_box}>
                    <Avatar />
                    {header}
                     <Text style={styles.text}>
                        How was your ride with {ride.customer.name}?
                    </Text>
                    <Line/>
                      <StarRating
                          onChange={this.rateRide}
                          maxStars={5}
                          rating={0}
                          colorOn={colors.rating}
                          colorOff={colors.action_disabled}
                      />
                    <Button
                        action={this.finishRide}
                        text={"FINISH"}
                        style={styles.primary_button_finalize}
                    />
                </View>
                <Banner/>
            </View>
        );
    },

    renderScene: function(route, navigator) {
        var ride = this.props.currentRide;
        var content =  
            <View>
                <View style={styles.avatar_centre}>
                    <Avatar
                        style={styles.avatar}
                    />
                </View>
            <View style={styles.text_box}>
                <Text style={styles.text_finalize}>
                    Something went wrong. Ride state {ride.state}
                </Text>
                <Link 
                    icon={'motorcycle'} 
                    text={'Return Home'}
                    action={() => this.props.navigator.push({id: 'DriverHomePage'})}
                />
            </View>
            </View>;

        var currentUser = this.props.currentUser;
        switch (ride.state) {
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
                content = this.renderDropOff();
                break;
            case 'payment':
                content = this.renderPayment();
                break;
            case 'finalized':
                content = this.renderFinalize();
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


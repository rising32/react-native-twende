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
        let url = "geo:?q=" + ride.origin.latitude + ","  + ride.origin.longitude;
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
                            url={this.openNavigation}
                            icon={'motorcycle'}
                            text={'ROUTE'}
                            align={'flex-start'}
                        /> : <Text />
                    }
                </View>
                <Avatar image={ride.customer.avatar}/>
                <View style={styles.renderItemRight}>
                    <SheetIcon
                        action={this.declineRide}
                        icon={'clear'}
                        text={'DECLINE'}
                        color={colors.disable}
                    />
                </View>
            </View>
        );
    },

    renderCustomer: function (customer) {
        return (
            <Text style={styles.customer_title}>
                {customer} 
            </Text>
        )
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

    renderFare: function (fare_amount, fare_currency) {
        return (
            <Text style={styles.heavy_text}>
                {fare_amount} {fare_currency}
            </Text>
        )
    },

    renderEarnings: function (fare_amount, fare_currency) {
        fare_amount = fare_amount * 0.8;
        return (
            <Text style={styles.text}>
                Rider earning: {fare_amount} {fare_currency} 
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

    renderHome: function() {
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
                <Avatar />
                <View style={styles.text_box}>
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
    },

    renderRequest: function() {
        var ride = this.props.currentRide;

        // components in screen
        var top = this.renderSheetTop(false);
        var header = this.renderHeader("Incoming Request"); 
        var customer = this.renderCustomer(ride.customer.name);          
        var away = this.renderText(away); 
        var text = this.renderText("Time to accept:"); 
        if (ride.driver_distance) {
            away = this.renderText(ride.driver_distance.distance + " (" + ride.driver_distance.duration + ") away");
        }

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
                <View style={styles.text_box}>
                    {customer}
                    {away}
                    <Rating
                        maxStars={5}
                        rating={ride.customer.rating}
                        colorOn={colors.secondary}
                        colorOff={colors.action_disabled}
                        size={20}
                        style={styles.item}
                    />
                    {text}
                    <View style={styles.timer}>
                        <Timer/>
                    </View>  
                </View>  
                <Button
                    action={this.acceptRide}
                    text={"ACCEPT REQUEST"}
                    color={colors.action}
                />        
            </View>
        );
    },

    renderAccepted: function() {
        var ride = this.props.currentRide;

        // components in screen
        var top = this.renderSheetTop();
        var header =this.renderHeader("Hi " + ride.customer.first_name + ",");           
        var text = this.renderText("First give me a call. Then pick me up."); 


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
                    <Link
                        url={"tel: " + ride.customer.phone}
                        size={14}
                        fontFamily={'gothamrounded_bold'}
                        color={colors.secondary}
                        text={" CALL " + ride.customer.name.toUpperCase()}
                        source={require('../assets/phone_icon_blue.png')}
                        imagestyle={styles.phone_icon}
                    />
                </View>  
                <Button
                    action={this.startRide}
                    text={"WE GO!"}
                    color={colors.action}
                    />        
            </View>
        );
    },

    renderDriving: function() {
        var ride = this.props.currentRide;

        // components in screen
        var top = this.renderSheetTop();
        var header =this.renderHeader("Hi" + ride.customer.first_name);           
        var text = this.renderText("Please offer me a helmet & hair net.\nRide carefully!");


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
                    {text}
                    <Link
                        url={"tel: 0791398120"}
                        size={14}
                        fontFamily={'gothamrounded_bold'}
                        color={colors.secondary}
                        text={" CALL SUPPORT"}
                        source={require('../assets/phone_icon_blue.png')}
                        imagestyle={styles.phone_icon}
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


    renderDropoff: function() {
        var ride = this.props.currentRide;
        
        // screen components
        var header = this.renderHeader("Payment");
        var ride_fare = this.renderFare(ride.ride_fare.amount, ride.ride_fare.currency);
        var rider_earnings = this.renderEarnings(this.props.currentRide.ride_fare.amount, this.props.currentRide.ride_fare.currency);
        var distance = this.renderDistance("The trip was " + ride.distance.distance);
        var text = this.renderText(ride.customer.first_name + " pays cash or M-pesa.\nPaybill No: 653839.\nAccount No: Ride");

        return  (
            <View style={styles.page_finalize}>    
                <View></View>
                <View style={styles.text_box}>
                    <Avatar />
                    {header}
                    {ride_fare}
                    {distance}
                    {rider_earnings}
                    <Line/>
                    {text}
                    <Button
                        action={this.finishRide}
                        style={styles.primary_button_finalize}
                        text={"FINALIZE"}
                    />
                </View>
                <Banner/>
            </View>
        );
    },

    renderFinalized: function() {
        var ride = this.props.currentRide;
        
        // screen components
        var header = this.renderHeader("Rating");
        var rider_earnings = this.renderEarnings(this.props.currentRide.ride_fare.amount, this.props.currentRide.ride_fare.currency);
        var text = this.renderText("How was your ride with " + ride.customer.first_name +"?");         

        return  (
            <View style={styles.page_finalize}>     
                <View>
                </View>      
                    <View style={styles.text_box}>
                        <Avatar />
                        {header}
                        {text}
                        <Line/>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                          <StarRating
                              onChange={this.rateRide}
                              maxStars={5}
                              rating={0}
                              colorOn={colors.action}
                              colorOff={colors.action_disabled}
                          />
                        </View>
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
        var content = this.renderHome();
        var currentUser = this.props.currentUser;
        if (currentUser.state != 'unavailable' && ride) {
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
                    content = this.renderDropoff();
                    break;
                case 'payment' :
                    if (!ride.driver_rating) {
                        content = this.renderFinalized();
                    }
                    break;
                case 'finalized' :
                    if (!ride.driver_rating) {
                        content = this.renderFinalized();
                    }
                    break;
            }
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

module.exports = DriverHomePage;

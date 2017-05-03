'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Alert,
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
var ImageLink = require('../Components/ImageLink');
var Button = require('../Components/Button');
var SheetIcon = require('../Components/SheetIcon');
var SheetAvatar = require('../Components/SheetAvatar');
var StarRating = require('../Components/StarRating');
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

    dropoffRide: function() {
        var ride = this.props.currentRide;
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

    renderSheetTop: function (decline_text, navigation_text) {
        var ride = this.props.currentRide;
        return (
             <View style={styles.sheet_top}>
                    <View style={styles.renderItemLeft}>
                        <ImageLink
                            url={"geo:?q=" + ride.origin.latitude + ","  + ride.origin.longitude}
                            text={"route"}
                            fontFamily={'gothamrounded_bold'}
                            size={13}
                            textAlign={'right'}
                            source={require('../assets/motorcycle_icon2.png')}
                            imagestyle={styles.cancel_icon}
                            color={colors.secondary}
                        />
                    </View>
                <View style={styles.avatar_centre}>
                    <Avatar image={ride.customer.avatar} />
                </View>
                    <View style={styles.renderItemRight}>
                         <ImageLink
                            action={this.declineRide}
                            fontFamily={'gothamrounded_bold'}
                            size={13}
                            color={colors.disable}
                            text={"DECLINE "}
                            sourceRight={require('../assets/cancel_icon.png')}
                            imagestyle={styles.cancel_icon}
                        />
                    </View>
            </View>
        )
    },

    renderSheetTopRequest: function (decline_text) {
        var ride = this.props.currentRide;
        return (
            <View style={styles.sheet_top}>
                <View style={styles.renderItemLeft}>
                </View>                
                <View style={{elevation: 10, justifyContent: 'center'}}>
                    <Avatar image={ride.customer.avatar} />
                </View>
                <View style={styles.renderItemRight}>
                    <ImageLink
                        action={this.declineRide}
                        fontFamily={'gothamrounded_bold'}
                        size={13}
                        color={colors.disable}
                        text={"DECLINE "}
                        sourceRight={require('../assets/cancel_icon.png')}
                        imagestyle={styles.cancel_icon}
                    />
                </View>
            </View>
        )
    },

    renderHome: function() {
        var is_available = this.state.currentUser.state == 'available';
        var questionText = "Are you available for a ride?";
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
                <View style={styles.avatar_centre_column}>
                     <Image
                        source={require('../assets/twende_avatar.png')}
                        style={styles.avatar}
                    />
                    <View style={styles.sheet_rider}>
                        <Text style={styles.item_title}>
                            Hi {this.props.currentUser.first_name},
                        </Text>
                       <Text style={styles.text}>
                            {questionText}
                        </Text>
                    </View>
                </View>
                    <View style={styles.toggle}>
                        <Button
                            action={() => this.toggleAvailability(false)}
                            style={styles.button_simple}
                            text={"Not available"}
                            color={colors.action}
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
        var top = this.renderSheetTopRequest("DECLINE");        
        var away = "Unknown distance customer";
        if (ride.driver_distance) {
            away = ride.driver_distance.distance + " (" + ride.driver_distance.duration + ") away";
        }
        let requesting = " INCOMING REQUEST. PLEASE CONFIRM. ";

        return  (
            <View style={{flex: 1, justifyContent: 'space-around'}}>
                <Map
                    title={"request"}
                    driver={ride.driver.position}
                    customer={ride.origin}
                />
                <View style={styles.sheet_rider}>
                    {top}
                    <View style={[styles.sheet_content, {justifyContent: 'center', alignItems: 'center'}]}>
                        <Text style={styles.item_title}>
                            Request from {ride.customer.name}
                        </Text>
                        <IconText
                            icon={"motorcycle"}
                            text={away}
                            color={colors.action_secondary}
                            size={14}
                            style={{marginBottom: 6}}
                        />
                        <View style={{flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', backgroundColor: colors.logins}}>
                        {this.state.showMessage ? (
                    <View style={{alignItems: 'center'}}>
                        <Timer ms={60000} expired={() => {this.showMessage}} />
                        <Text style={{fontFamily: 'gothamrounded_bold', color: colors.secondary, fontSize: 14}}>
                            {requesting}
                        </Text>
                    </View>
                    ) : (
                        <View style={{alignItems: 'center'}}>
                            <Timer ms={60000} expired={() => {this.showMessage}} />
                            <Text style={{textAlign: 'center', fontFamily: 'gothamrounded_bold', color: colors.secondary, fontSize: 14}}>
                                Request will be cancelled in 30 seconds.
                            </Text>
                        </View>
                    )}                    
 
                        </View>
                    </View>
                    <View style={styles.primary_button_simple}>
                        <Button
                            action={this.acceptRide}
                            text={"ACCEPT REQUEST"}
                            color={colors.action}
                            />
                    </View> 
                </View>
            </View>
        );
    },

    renderAccepted: function() {
        var ride = this.props.currentRide;
        var top = this.renderSheetTop("DECLINE ", "  NAVIGATION");
        return  (
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                <Map
                    title={"request"}
                    driver={ride.driver.position}
                    customer={ride.origin}
                />
                {top}
                <View style={styles.sheet_rider}>
                    <Text style={styles.item_title}>
                        Hi {rider.customer.first_name}, 
                    </Text>
                    <Text style={styles.text}> 
                        First give me a call. Then pick me up.
                    </Text>
                    <View style={{flexDirection: 'row', margin: 16, justifyContent: 'center'}}>
                        <ImageLink
                            url={"tel: " + ride.customer.phone}
                            size={14}
                            fontFamily={'gothamrounded_bold'}
                            color={colors.action}
                            text={" CALL " + ride.customer.name.toUpperCase()}
                            source={require('../assets/phone-icon.png')}
                            imagestyle={styles.phone_icon}
                        />
                    </View>
                    <View style={styles.primary_button_simple}>
                        <Button
                            action={this.startRide}
                            text={"WE GO!"}
                            color={colors.action}
                        />
                    </View>
                </View>
            </View>
        );
    },

    renderDriving: function() {
        var ride = this.props.currentRide;
        var top = this.renderSheetTop("", "NAVIGATION");
        return  (
            <View style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between'}}>
                <Map
                    title={"request"}
                    driver={ride.driver.position}
                    customer={ride.origin}
                />  
                {top}
                <View style={styles.sheet_rider}>
                    <Text style={styles.text}>
                        Please offer me a helmet & hair net. Ride carefully!
                    </Text>
                        <View style={{flexDirection: 'row', margin: 16, justifyContent: 'center'}}>
                        <ImageLink
                            url={"tel: " + ride.customer.phone}
                            size={14}
                            fontFamily={'gothamrounded_bold'}
                            color={colors.action}
                            text={" CALL " + ride.customer.name.toUpperCase()}
                            source={require('../assets/phone-icon.png')}
                            imagestyle={styles.phone_icon}
                        />
                    </View>
                        <View style={styles.primary_button_simple}>
                              <Button
                                action={this.dropoffRide}
                                text={"FINISH RIDE"}
                                />
                        </View>
                  </View>
            </View>
        );
    },


renderDropoff: function() {
        var ride = this.props.currentRide;
        var text = ride.customer.first_name + " pays cash or M-pesa\nPaybill No: 653839\nAccount No: Ride"; 
        var header = "Payment";
        var buttonText = "FINALIZE";
        var buttonAction = this.finishRide;

        return  (
            <View style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: colors.primary}}
            >              
                <View style={{backgroundColor: colors.primary}}>
                </View>      
                    <View style={styles.card_mid_finalize}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', elevation: 5}}>                   
                                <Avatar image={ride.customer.avatar}/>
                            </View>
                            <Text style={[styles.item_title, {textAlign: 'center'}]}>
                                {header}
                            </Text>
                            <Text style={styles.heavy_text}>
                                {ride.ride_fare.amount} {ride.ride_fare.currency}
                            </Text>
                            <Text style={styles.text}>
                                    Distance: {ride.distance.distance}
                                </Text>
                            <View>
                               <Text style={{fontFamily: 'gothamrounded_book', textAlign: 'center'}}>
                                    {text}
                                </Text>
                            </View>
                        <View style={{flexDirection: 'row'}}>
                          <Button
                              action={buttonAction}
                              text={buttonText}
                              />
                        </View>
                    </View>
                    <View>
                        <Image
                            source={require('../assets/banner.jpg')}
                            style={styles.banner}
                            />
                    </View>
                </View>
            );
        },


    renderFinalized: function() {
        var ride = this.props.currentRide;
        var message = "How was your ride with {ride.customer.first_name} ";
        var header = "Rating";
        var buttonText = "FINISH";
        var buttonAction = this.finishRide;

               return  (
            <View style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: colors.primary}}
            >              
                <View style={{backgroundColor: colors.primary}}>
                </View>      
                    <View style={styles.card_mid_finalize}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', elevation: 5}}>                   
                                <Avatar image={ride.customer.avatar}/>
                            </View>
                    <View>
                        <Text style={[styles.item_title, {textAlign: 'center'}]}>
                            {header}
                        </Text>
                        <Text style={{fontFamily: 'gothamrounded_book', textAlign: 'center', marginTop: 6}}>
                            {message}
                        </Text>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                          <StarRating
                              onChange={this.rateRide}
                              maxStars={5}
                              rating={0}
                              colorOn={colors.action}
                              colorOff={colors.action_disabled}
                          />
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Button
                          action={buttonAction}
                          text={buttonText}
                          />
                    </View>
                </View>
                <View>
                    <Image
                        source={require('../assets/banner.jpg')}
                        style={styles.banner}
                        />
                </View>
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

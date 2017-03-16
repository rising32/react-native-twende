'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Alert,
    View,
    Text,
    TextInput,
    Switch,
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
            price: 0
        }
    },

    componentWillMount: function() {
        GeoLocationStore.on(events.geoLocationLoaded, this.updateLocation);
        CurrentUserStore.on(events.currentUserLoaded, this.currentUserLoaded);
        loadGeoLocation();
        startWatchingGeoLocation();
    },

    componentWillUnmount: function() {
        GeoLocationStore.removeListener(events.geoLocationLoaded, this.updateLocation);
        CurrentUserStore.removeListener(events.currentUserLoaded, this.currentUserLoaded);
        stopWatchingGeoLocation();
    },

    currentUserLoaded: function(currentUser) {
        this.setState({currentUser: currentUser});
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
        reloadCurrentUser();
    },

    declineRide: function(ride) {
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
            <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-between', marginTop: -40, marginBottom: -15, elevation: 5}}>
                <TouchableOpacity onPress={() => this.declineRide(ride)}>
                      <View style={styles.renderSheetTopItem}>
                        <Text style={{fontSize: 15, color: colors.disable}}>
                            {decline_text}
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={{marginLeft: 10}}>
                    <Avatar image={ride.customer.avatar} />
                </View>
                    <View style={styles.renderSheetTopItem}>
                      <Link
                          url={"geo:?q=" + ride.origin.latitude + ","  + ride.origin.longitude}
                          text={navigation_text}
                          size={15}
                          color={colors.secondary}
                          iconSize={18}
                      />
                    </View>
            </View>
        )
    },

    renderSheetTopRequest: function (decline_text) {
        var ride = this.props.currentRide;
        return (
            <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-between', marginTop: -40, marginBottom: -15, elevation: 5}}>
                <TouchableOpacity onPress={() => this.declineRide(ride)}>
                      <View style={styles.renderSheetTopItem}>
                        <Text style={{fontSize: 15, color: colors.disable}}>
                            {decline_text}
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={{marginLeft: 10, marginRight: 14}}>
                    <Avatar image={ride.customer.avatar} />
                </View>
                <View style={styles.renderSheetTopItem}>
                </View>
            </View>
        )
    },

    renderSheetTopDropoff: function () {
        var ride = this.props.currentRide;
        return (
            <View style={{justifyContent: 'space-between', alignSelf: 'center', flexDirection: 'row', elevation: 5}}>
                <Avatar image={ride.customer.avatar} />
            </View>

        )
    },

    renderHome: function() {
        var is_available = this.state.currentUser.state == 'available';
        var statusText = "Customer cannot find you.";
        var statusIcon = "not-interested";
        if (is_available) {
            statusText = "Customer can find you.";
            statusIcon = "alarm";
        }
        return  (
            <View style={styles.page}>
                <View style={{flex: 0.6}}>
                </View>
                <View style={{flex:0.4}}>
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
                    <View style={{alignItems: 'center'}}>
                        <IconText
                            icon={statusIcon}
                            text={statusText}
                            color={colors.action_secondary}
                            style={{margin: 10}}
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
        return  (
            <View style={{flex: 1, justifyContent: 'space-around'}}>
                <Map
                    title={"request"}
                    driver={ride.driver.position}
                    customer={ride.origin}
                />
                <View style={styles.sheet_rider}>
                    {top}
                    <View style={styles.sheet_content}>
                         <Text style={styles.item_title}>
                            Request from {ride.customer.name}!
                        </Text>
                        <IconText
                          icon={"motorcycle"}
                          text={away}
                          color={colors.secondary}
                          size={16}
                          style={{padding: 6, margin: 6, marginLeft: -5, marginRight: -5}}
                        />
                    </View>
                    <View style={{flexDirection: 'row'}}>
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
        var top = this.renderSheetTop("DECLINE", "NAVIGATION");
        return  (
          <View style={{flex: 1, justifyContent: 'space-between'}}>
                    <Map
                        title={"request"}
                        driver={ride.driver.position}
                        customer={ride.origin}
                    />
                    <View style={styles.sheet_rider}>
                          {top}
                          <View style={{flexDirection: 'column', marginTop: 34, marginBottom: 18, marginLeft: -10, justifyContent: 'space-between', alignItems: 'center'}}>
                                <Link
                                    url={"tel: " + ride.customer.phone}
                                    icon={"phone"}
                                    size={16}
                                    iconSize={24}
                                    color={colors.secondary}
                                    text={"CALL " + ride.customer.first_name.toUpperCase()}
                                />
                          </View>
                          <View style={{flexDirection: 'row'}}>
                                <Button
                                    action={this.startRide}
                                    text={"START TRIP"}
                                    color={colors.action}
                                    />
                          </View>
                    </View>
              </View>
        );
    },

    renderDriving: function() {
        var ride = this.props.currentRide;
        var top = this.renderSheetTop("DECLINE", "NAVIGATION");
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
                <View style={styles.sheet_rider}>
                    {top}
                        <Text style={[styles.item_title, {marginTop: 30, marginBottom: 10, alignSelf: 'center'}]}>
                            Have a safe journey!
                        </Text>
                        <View style={{flexDirection: 'column', marginTop: 5, marginBottom: 10, marginLeft: -10, justifyContent: 'space-between', alignItems: 'center'}}>
                          <Link
                              url={"tel: " + ride.customer.phone}
                              icon={"phone"}
                              size={16}
                              iconSize={24}
                              color={colors.secondary}
                              text={"CALL " + ride.customer.first_name.toUpperCase()}
                          />
                        </View>
                        <View style={{flexDirection: 'row', marginLeft: 0, marginRight: 0}}>
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
        var top = this.renderSheetTopDropoff();
        return  (
            <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: colors.primary}}>
                <View style={styles.sheetYellow}>
                    <View
                        style={{flex: 0.1, backgroundColor: colors.primary}}>
                    </View>
                    <View style={styles.card_mid_finalize}>
                        <View>
                        {top}
                        </View>
                         <View>
                            <Text style={[styles.item_title, {textAlign: 'center'}]}>
                                Payment
                            </Text>
                            <Text style={styles.heavy_text}>
                                {ride.fare}
                            </Text>
                        </View>
                            <Text style={[styles.text_important, {textAlign: 'center', fontSize: 15, marginBottom: 3}]}>
                                Client chooses cash or M-pesa. If there are issues finalizing ride, call customer support:
                            </Text>
                                <Link
                                    url={"tel: 0791398120"}
                                    icon={"phone"}
                                    size={16}
                                    iconSize={18}
                                    color={colors.action}
                                    text={"0791398120"}
                                />
                        <View style={{flexDirection: 'row', marginTop: 6}}>
                            <Button
                                action={this.refreshRide}
                                text={"CONFIRM"}
                            />
                        </View>
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
        var text;
      if (ride.payment_method == 'mpesa') {
            var header = "M-Pesa Payment";
            text = "Paybill No: 653839\nAccount No: Ride";

        } else {
            var header = "Cash Payment";
            var text = ride.customer.first_name + " is paying cash";          
        }
        
        var buttonText = "SUBMIT";
        var buttonAction = this.finishRide;
        var top = this.renderSheetTopDropoff();


        return  (
            <View style={{flex: 1, backgroundColor: colors.primary}}>
                <View style={styles.sheetYellow}>
                    <View style={{flex: 0.1, backgroundColor: colors.primary}}>
                    </View>
                    <View style={styles.card_mid_finalize}>
                        <View>
                            {top}
                        </View>
                        <View>
                              <Text style={[styles.item_title, {textAlign: 'center'}]}>
                                    {header}
                              </Text>
                              <Text style={styles.heavy_text}>
                                   {ride.fare}
                              </Text>
                        <View>
                               <Text style={[styles.text_important, {textAlign: 'center', marginTop: 2, marginBottom: 4}]}>
                                    {text}
                                </Text>
                        </View>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                              <Text style={[styles.item_title, {textAlign: 'center'}]}>
                                Rate Customer
                              </Text>
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
                rider home
            </Text>
        );
    }
};

module.exports = DriverHomePage;

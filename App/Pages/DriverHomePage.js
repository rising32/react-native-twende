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
    ToastAndroid
    } = ReactNative;

import CustomerStore from '../Stores/CustomerStore';
import CurrentRideStore from '../Stores/CurrentRideStore';
import CurrentUserStore from '../Stores/CurrentUserStore';
var Map = require('../Components/Map');
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

    getInitialState: function () {
        var region =  {
            latitude: -1.2,
            longitude: 36.7,
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
        startWatchingGeoLocation();
    },

    componentWillUnmount: function() {
        stopWatchingGeoLocation();
    },

    refreshItems: function(){
        ToastAndroid.show('Checking for customers.', ToastAndroid.SHORT);
        loadCustomerList();
    },

    userLoaded: function(currentUser){
        alert(JSON.stringify(currentUser));
        this.setState('currentUser', currentUser);
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
        this.setState({currentRide: ride});
        updateCurrentRide(ride);
    },

    // Hieronder eerste aanzet tot een berichtje bij de rider om de consument
    // te bellen nadat hij klant heeft geaccepteerd (Kreeg 'bad gateway errors' > dus kon
    // nog niet testen of het werkt)

/*        giveCall: function() {
        Alert.alert(
            Please give customer a call to ask for correct directions.
            [
                {text: 'OK', onPress: () => {}}
            ]
        );
    },*/

    // Onderstaand stukje zou dan onder RenderAccepted moeten komen:
    // sorry voor de chaos :()

                      //          <Button
                      //          action={this.giveCall}
                      //          text={"FINISH"}
                      //          textStyle={{fontWeight: 'bold'}}
                      //          color={colors.action}
                      //          />


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
        var ride = this.props.currentRide;
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

    renderHome: function() {
        var is_available = this.state.currentUser.state == 'available';
        var statusText = "Customer cannot find you.";
        var statusIcon = "not-interested";
        if (is_available) {
            statusText = "Customer can find you.";
            statusIcon = "alarm";
        }
        return  (
            <View style={{flex: 1, marginTop: 20}}>
                <View style={styles.toggle}>
                    <Link
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
                    <Link
                        action={() => this.toggleAvailability(true)}
                        style={styles.button_simple}
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
            </View>
        );
    },

    renderRequest: function() {
        var ride = this.props.currentRide;
        var top = this.renderSheetTop(this.acceptRide, 'check');
        //var away = ride.driver_distance.distance + ' (' + ride.driver_distance.duration + ') away.';
        var away = 'Customer has requested';
        return  (
            <View>
                <Map
                    title={"request"}
                    driver={ride.driver.position}
                    customer={ride.origin}
                />
                <View style={styles.sheet}>
                    {top}
                    <View style={styles.sheet_content}>
                         <Text style={styles.item_title}>
                            Request from {ride.customer.name}!
                        </Text>
                        <Text style={styles.text_important}>
                           Confirm customer by pushing green button.
                        </Text>
                    </View>
                </View>
            </View>
        );
    },



    renderAccepted: function() {
        var ride = this.props.currentRide;
        var top = this.renderSheetTop(this.startRide, 'group');
        return  (
            <View style={{flexDirection: 'row'}}>
                <View>
                    <Map
                        title={"request"}
                        driver={ride.driver.position}
                        customer={ride.origin}
                    />
                    <View style={styles.sheet}>
                        {top}
                        <View style={styles.sheet_content}>
                            <Text style={styles.item_title}>
                                Confirm picking up {ride.customer.name}
                            </Text>
                            <Text style={styles.text_important}>
                                Push green button when you have arrived at customer.
                            </Text> 
                            <Link style={{margin: 10}}
                                url={"tel: " + ride.customer.phone}
                                icon={"phone"}
                                size={16}
                                iconSize={24}
                                color={colors.action}
                                text={"CALL " + ride.customer.name.toUpperCase()}
                            />
                            <Link
                                icon={"pin-drop"}
                                url={"geo:?q=" + ride.origin.latitude + ","  + ride.origin.longitude}
                                text={'start navigation'.toUpperCase()}
                                color={colors.action}
                                size={16}
                                iconSize={24}
                                style={{margin: 10}}
                            />
                        </View>            
                    </View>
                </View>
            </View>
        );

    },

    renderDriving: function() {
        var ride = this.props.currentRide;
        var top = this.renderSheetTop(this.dropoffRide, 'beenhere');
        return  (
            <View>
                <Map
                    title={"request"}
                    driver={ride.driver.position}
                    customer={ride.origin}
                />
                <View style={styles.sheet}>
                    {top}
                    <View style={styles.sheet_content}>
                        <Text style={styles.item_title}>
                            Finish ride
                        </Text>
                        <Text style={styles.text_important}>
                            When you drop off the client; please confirm by clicking the green button.
                        </Text>
                    </View>
                </View>
            </View>
        );

    },

    renderDropoff: function() {
        var ride = this.props.currentRide;
        var top = this.renderSheetTop(this.finishRide, 'tag-faces');
        return  (
            <View>
                <View style={{height: 100, backgroundColor: '#888888'}}>
                </View>
                <View style={styles.sheet}>
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
                            <Button
                                action={this.finishRide}
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
        var content = this.renderHome();
        if (this.props.currentUser.state != 'unavailable') {
            if (this.props.currentRide) {
                switch (this.props.currentRide.state) {
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
                RIDER HOME
            </Text>
        );
    }
};

module.exports = DriverHomePage;

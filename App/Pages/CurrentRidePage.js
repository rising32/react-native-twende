'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Alert,
    View,
    Text,
    ActivityIndicator,
    Image,
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
import { sounds } from "../Sounds";

var SheetIcon = require('../Components/SheetIcon');


var CurrentRidePage = React.createClass({

    getInitialState: function () {
        return {
            currentUser: this.props.currentUser,
            currentRide: this.props.currentRide,
            isLoading: false,
            price: 0,
            rating: 0,
            animating: true
        }
    },

    cancelRide: function () {
        ToastAndroid.show('Ride canceled', ToastAndroid.LONG);
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
        ToastAndroid.show('Checking State Rider..', ToastAndroid.SHORT)
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
        let requesting = " WAITING FOR RESPONSE... ";
        return (
            <View style={{flex: 1, backgroundColor: colors.login}}>
                <View style={styles.map_container}>
                    <Map
                        title= {"Connecting..."}
                        driver={ride.driver.position}
                        customer={ride.origin}
                    />
                </View>
                 <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: -30, margin: 6}}>
                    <View style={styles.renderItemLeft}>
                        <Link
                            action={this.cancelRide}
                            icon={"clear"}
                            size={15}
                            iconSize={18}
                            color={colors.disable}
                            text={"CANCEL"}
                        />
                    </View>
                       <View style={{flex: 1, justifyContent: 'center'}}>
                        <Avatar image={ride.driver.avatar}/>
                    </View>
                    <View style={styles.renderItemRight}>
                        <Link 
                            url={"tel: " + ride.driver.phone}
                            iconRight={"phone"}
                            size={15}
                            iconSize={18}
                            alignText={'right'}
                            color={colors.secondary}
                            text={"CALL RIDER  "}
                        />
                    </View>
                </View>
                <View style={styles.sheet_dark}>
                    <View>
                        <Text style={[styles.item_title, {textAlign: 'center'}]}>
                            Requesting {ride.driver.name}!
                        </Text>
                        <View style={{flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', backgroundColor: colors.logins}}>
                                <ActivityIndicator 
                            animating={this.state.animating}
                            size={30}
                            color={colors.disable} 
                        /> 
                        <View style={{alignSelf: 'center'}}>
                                <Text style={{fontFamily: 'gothamrounded_medium', color: colors.secondary, fontWeight: 'bold'}}>
                                    {requesting}
                                </Text> 
                        </View>
                    </View>
                        <Text style={{fontFamily: 'gothamrounded_book', textAlign: 'center', margin: 2, color: colors.action_secondary}}>
                            Call rider or call support if no response
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Button
                            action={this.refreshRide}
                            text={'NEXT STEP'}
                            size={15}
                            iconSize={18}
                            color={colors.action}
                          />
                    </View>
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
        // var away = "Rider is on his way...";
        // Once the time / distance of rider to customer can be upated along the way it
        // would be interesting to implement this the 'away variable'
        //
        // if (ride.driver_distance) {
        //    away = ride.driver_distance.distance + ' (' + ride.driver_distance.duration + ') away';
        // }
        //                         <IconText
        //                icon={"motorcycle"}
        //                text={away}
        //                color={colors.secondary}
        //                style={{padding: 6, margin: 14}}
        //                />

        return (
            <View style={{flex: 1, backgroundColor: colors.login}}>
                <Map
                    title={"rider on his way"}
                    driver={ride.driver.position}
                    customer={ride.origin}
                />
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: -30}}>
                      <View style={styles.renderItemLeft}>
                        <Link
                            action={this.cancelRide}
                            icon={"clear"}
                            size={15}
                            iconSize={18}
                            color={colors.disable}
                            text={"CANCEL"}
                        />
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <Avatar image={ride.driver.avatar}/>
                    </View>
                    <View style={styles.renderItemRight}>
                        <Link 
                            url={"tel: " + ride.driver.phone}
                            iconRight={"phone"}
                            size={15}
                            iconSize={18}
                            color={colors.secondary}
                            text={"CALL RIDER  "}
                        />
                    </View>
                    </View>
                    <View style={styles.card_mid}>
                        <Text style={styles.item_title}>
                            Hi {ride.customer.first_name},
                        </Text>
                        <Text style={{fontFamily: 'gothamrounded_book', textAlign: 'center'}}>
                         {ride.driver.first_name} is on his way to pick you up!
                        </Text>
                    </View>
                     <View style={{margin: 12, flexDirection: 'row', alignItems: 'center'}}>
                        <Button
                            action={this.refreshRide}
                            text={'NEXT STEP'}
                            size={15}
                            iconSize={18}
                            color={colors.action}
                        />
                    </View>
                </View>
        )
    },

    renderDriving: function () {
        var ride = this.props.currentRide;
        let text = "When the rider ends trip click GO TO PAYMENT";
        return (
            <View style={{flex: 1, backgroundColor: colors.login, justifyContent: 'space-between'}}>
                <Map
                    style={{flex: 1}}
                    driver={ride.driver.position}
                    customer={ride.origin}
                />
                <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 6, marginTop: -30}}>
                    <View style={styles.renderItemLeft}>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <Avatar image={ride.driver.avatar}/>
                    </View>
                    <View style={styles.renderItemRight}>
                        <Link 
                            url={"tel: " + ride.driver.phone}
                            iconRight={"phone"}
                            size={14}
                            iconSize={16}
                            color={colors.secondary}
                            text={"  CALL RIDER  "}
                        />
                    </View>
                </View>
                <View style={[styles.sheet_dark, {alignItems: 'center'}]}>
                    <View style={styles.card_mid}>
                        <Text style={styles.item_title}>
                            Finalize Ride
                        </Text>
                         <Text style={{fontFamily: 'gothamrounded_book', textAlign: 'center'}}>
                            {text} 
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Button
                            action={this.refreshRide}
                            text={'GO TO PAYMENT'}
                            size={15}
                            iconSize={18}
                            color={colors.action}
                        />
                    </View>
                </View>
            </View>
        )
    },

renderDropOff: function () {
        sounds.alarm2.play();
        var ride = this.props.currentRide;

        return (
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
                            <Avatar image={ride.driver.avatar}/>
                        </View>
                        <View style={{margin: 6, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={styles.item_title}>
                              Price
                            </Text>
                            <Text style={styles.heavy_text}>
                              {ride.fare}
                            </Text>
                            <Text style={{fontFamily: 'gothamrounded_book', textAlign: 'center'}}>
                                Your trip was {ride.distance.distance}.
                            </Text>
                        </View>
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
                <View>
                      <Image
                          source={require('../assets/banner.jpg')}
                          style={styles.banner}
                          />
                </View>
            </View>
        )
    },

    renderPayment: function () {
        var ride = this.props.currentRide;
         var text;
      
      if (ride.payment_method == 'mpesa') {
          var header = "M-Pesa Payment";
          text = "Paybill No: 653839" + "\n" + "Account No: Ride";
        } else {
          var header = "Cash Payment";  
          var text = "Please pay the cash amount to rider";
      }

        return (
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
                            <Avatar image={ride.driver.avatar}/>
                        </View>
                        <View style={{margin: 6, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={styles.item_title}>
                                {header}
                            </Text>
                            <Text style={styles.heavy_text}>
                                {ride.fare}
                            </Text>
                           <Text style={{fontFamily: 'gothamrounded_book', textAlign: 'center', marginTop: 6}}>
                                {text}
                            </Text>
                        </View>
                            <View style={{flexDirection: 'row'}}>
                                <Button
                                    action={this.completePayment}
                                    text={"FINALIZE"}
                                    color={colors.action}
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
        )
    },


    renderFinalize: function () {
      var ride = this.props.currentRide;
      var message = "How was your ride with " + ride.driver.name +"?";
      var header = "Rating";
      var buttonText = "FINISH";
      var buttonAction = this.finishRide;

      return (
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
                        <Avatar image={ride.driver.avatar}/>
                    </View>
                    <View style={{margin: 6, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.item_title}>
                            {header}
                        </Text>
                        <Text style={{fontFamily: 'gothamrounded_book', textAlign: 'center', marginTop: 6}}>
                            {message}
                        </Text>
                        <StarRating
                            onChange={this.rateRide}
                            maxStars={5}
                            rating={0}
                            colorOn={colors.action}
                            colorOff={colors.action_disabled}
                        />
                        <View style={{alignSelf: 'center'}}>
                            <Text style={{fontFamily: 'gothamrounded_book', textAlign: 'center', marginTop: 6}}>
                                We appreciate feedback!
                            </Text>
                        </View>
                    </View>
                    <Link
                        url={"tel: 0791398120"}
                        icon={"phone"}
                        size={16}
                        iconSize={18}
                        color={colors.action}
                        text={"0791398120"}
                    />
                    <View style={{flexDirection: 'row'}}>
                            <Button
                                action={this.finishRide}
                                text={"FINISH"}
                                color={colors.action}
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



module.exports = CurrentRidePage;

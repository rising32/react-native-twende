'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Alert,
    View,
    Text,
    Image,
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
        return (
            <View style={{flex: 1, backgroundColor: colors.login}}>
                <Map
                    title= {"Connecting..."}
                    driver={ride.driver.position}
                    customer={ride.origin}
                />
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: -30, margin: 6}}>
                    <View style={styles.renderSheetTopItem}>
                        <Link
                            action={this.cancelRide}
                            icon={"clear"}
                            size={15}
                            iconSize={18}
                            color={colors.disable}
                            text={"CANCEL"}
                        />

                    </View>
                    <View style={{marginLeft: 6}}>
                        <Avatar image={ride.driver.avatar}/>
                    </View>
                    <View style={styles.renderSheetTopItem}>
                        <Link
                              action={this.refreshRide}
                              text={'REFRESH'}
                              icon={'autorenew'}
                              size={15}
                              iconSize={18}
                              color={colors.action}
                          />
                    </View>
                </View>
                <View style={styles.sheet_dark}>
                    <View>
                        <Text style={[styles.item_title, {textAlign: 'center'}]}>
                                Requesting {ride.driver.name}!
                        </Text>
                        <Text style={{textAlign: 'center', margin: 2, color: colors.action_secondary}}>
                            Wait for call of {ride.driver.first_name} or call with button below
                        </Text>
                    </View>
                        <View style={{marginLeft: -8, alignItems: 'center'}}>
                            <Link style={{margin: 16}}
                                  url={"tel: " + ride.driver.phone}
                                  icon={"phone"}
                                  size={16}
                                  iconSize={24}
                                  color={colors.secondary}
                                  text={"CALL " + ride.driver.name.toUpperCase()}
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
                 <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: -30, margin: 6}}>
                      <View style={styles.renderSheetTopItem}>
                        <Link
                            action={this.cancelRide}
                            icon={"clear"}
                            size={15}
                            iconSize={18}
                            color={colors.disable}
                            text={"CANCEL"}
                        />

                    </View>
                    <View style={{marginLeft: 6}}>
                        <Avatar image={ride.driver.avatar}/>
                    </View>
                    <View style={styles.renderSheetTopItem}>
                        <Link
                              action={this.refreshRide}
                              text={'REFRESH'}
                              icon={'autorenew'}
                              size={15}
                              iconSize={18}
                              color={colors.action}
                          />
                    </View>
                    </View>
                    <View style={styles.card_mid}>
                        <Text style={styles.item_title}>
                            Hi {ride.customer.first_name},
                        </Text>
                        <Text>
                            I'm on my way to pick you up!
                        </Text>
                    </View>
                    <View style={styles.sheet_dark}>
                        <View style={{alignItems: 'center', marginRight: 10}}>
                            <Link style={{margin: 16}}
                                url={"tel: " + ride.driver.phone}
                                icon={"phone"}
                                size={16}
                                iconSize={24}
                                color={colors.action}
                                text={"CALL " + ride.driver.name.toUpperCase()}
                            />
                        </View>
                    </View>
                </View>

        )
    },

    renderDriving: function () {
        var ride = this.props.currentRide;
        return (
            <View style={{flex: 1, backgroundColor: colors.login, justifyContent: 'space-between'}}>
                <Map
                    style={{flex: 1}}
                    driver={ride.driver.position}
                    customer={ride.origin}
                />
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: -30, margin: 10}}>
                    <View style={styles.renderSheetTopItem}>
                        <Link
                            action={this.cancelRide}
                            size={15}
                            color={colors.disable}
                            text={"CANCEL"}
                        />
                    </View>
                    <View>
                        <Avatar image={ride.driver.avatar}/>
                    </View>
                    <View style={styles.renderSheetTopItem}>
                         <Link
                              action={this.refreshRide}
                              text={'PAYMENT '}
                              iconRight={'fast-forward'}
                              size={15}
                              iconSize={18}
                              color={colors.action}
                          />

                    </View>
                </View>
                        <View style={styles.card_mid}>
                            <Text style={styles.item_title}>
                                Let's go!
                            </Text>
                            <Text>
                                Your are on your way now.
                            </Text>
                            <Text>
                                Enjoy the ride. :)
                            </Text>
                        </View>
                       <View style={styles.sheet_dark}>
                        <View style={{alignItems: 'center', marginRight: 10}}>
                            <Link style={{margin: 16}}
                                url={"tel: " + ride.driver.phone}
                                icon={"phone"}
                                size={16}
                                iconSize={24}
                                color={colors.action}
                                text={"CALL " + ride.driver.name.toUpperCase()}
                            />
                        </View>
                    </View>
                    </View>

        )
    },

    renderDropOff: function () {
        var ride = this.props.currentRide;
        return (
            <View style={{flex: 1, backgroundColor: colors.login, justifyContent: 'space-between'}}>
                <View style={styles.sheetYellow}>
                    <View
                      style={{flex: 0.15, backgroundColor: colors.primary}}>
                    </View>
                    <View style={styles.card_mid_finalize}>
                        <View style={{alignSelf: 'center', elevation: 5}}>
                          <Avatar image={ride.driver.avatar}/>
                        </View>
                        <View style={{margin: 6, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={styles.item_title}>
                              Payment
                            </Text>
                            <Text style={styles.heavy_text}>
                              {ride.fare}
                            </Text>
                            <Text style={{textAlign: 'center'}}>
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
      var phone;
      if (ride.payment_method == 'mpesa') {
          phone = "Please send the money to 07 19 33 19 03";
        } else {
          var phone = "Thanks for your cash payment";
      }
      var header = "Finalize";
      var buttonText = "Done";
      var buttonAction = this.completePayment;

        return (
            <View style={{flex: 1, backgroundColor: colors.login, justifyContent: 'space-between'}}>
                <View style={styles.sheetYellow}>
                    <View
                      style={{flex: 0.15, backgroundColor: colors.primary}}>
                    </View>
                    <View style={styles.card_mid_finalize}>
                        <View style={{alignSelf: 'center', elevation: 5}}>
                            <Avatar image={ride.driver.avatar}/>
                        </View>
                        <View style={{margin: 6, padding: 12, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={styles.item_title}>
                              {header}
                            </Text>
                            <Text style={styles.heavy_text}>
                              {ride.fare}
                            </Text>
                            <Text style={{textAlign: 'center'}}>
                                {phone}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Button
                                action={buttonAction}
                                text={buttonText}
                                color={colors.action}
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

        )
    },


    renderFinalize: function () {
      var ride = this.props.currentRide;
      var message = "How was your ride with " + ride.driver.name +"?";
      var header = "Rate this ride";
      var buttonText = "Finish";
      var buttonAction = this.finishRide;

        return (
          <View style={{flex: 1, backgroundColor: colors.login, justifyContent: 'space-between'}}>
              <View style={styles.sheetYellow}>
                    <View
                      style={{flex: 0.15, backgroundColor: colors.primary}}>
                    </View>
                      <View style={styles.card_mid_finalize}>
                            <View style={{marginTop: -10, alignSelf: 'center', elevation: 5}}>
                              <Avatar image={ride.driver.avatar}/>
                            </View>
                            <View style={{margin: 6, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={styles.item_title}>
                                  {header}
                                </Text>
                                <Text style={{textAlign: 'center'}}>
                                    {message}
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
                                     action={this.finishRide}
                                     text={"FINISH"}
                                     color={colors.action}
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

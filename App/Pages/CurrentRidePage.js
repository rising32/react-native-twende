'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    AppRegistry,
    Alert,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    Navigator,
    ToastAndroid,
    } = ReactNative;
import {colors, styles} from "../Styles";
import Avatar from "../Components/Avatar";
import { Icon } from 'react-native-material-design';
var Rating = require('../Components/Rating');
var Banner = require('../Components/Banner');
var IconText = require('../Components/IconText');
var Iconed = require('../Components/Iconed');
var StepBar = require('../Components/StepBar');
var Map = require('../Components/Map');
var Link = require('../Components/Link');
var Line = require('../Components/Line');
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
import { Bubbles } from 'react-native-loader';
import Timer from 'react-native-timer-component';
import TimerMixin from 'react-timer-mixin';
const timer = require('react-native-timer');
var SheetIcon = require('../Components/SheetIcon');

var CurrentRidePage = React.createClass({

    getInitialState: function () {
        return {
            currentUser: this.props.currentUser,
            currentRide: this.props.currentRide,
            isLoading: false,
            price: 0,
            rating: 0,
            animating: true,
            showMessage: true
        }
    },

    componentDidMount() {
        this.showMessage();
    },

    componentWillUnmount() {
        timer.clearTimeout(this);
        timer.clearInterval(this);
    },

    startRidePoller() {
        timer.setInterval(
            this, 'pollRide', this.refreshRide, 10000
        );
    },

    refreshRide: function () {
        refreshCurrentRide(this.props.currentRide.id);
    },

    // message when time is up when requesting rider
    showMessage: function () {
        this.setState({showMessage: true}, () => timer.setTimeout(
            this, 'hideMessage', () => this.setState({showMessage: false}), 60000
        ));
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

    rateRide: function (rating) {
        this.setState({rating: rating});
    },

    finishRide: function() {
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

    renderSheetTop: function (renderRoute=true, renderAvatar=true) {
        var ride = this.props.currentRide;

        return (
            <View style={styles.sheet_top}>
                <View style={styles.renderItemLeft}>
                </View>
                {renderAvatar ?
                    <Avatar image={ride.driver.avatar}/>
                : <Avatar/>
                }
                <View style={styles.renderItemRight}>
                {renderRoute ?
                    <SheetIcon
                        align={'center'}
                        action={this.cancelRide}
                        name={'clear'}
                        text={'CANCEL'}
                        color={colors.white}
                        size={20}
                        backgroundColor={colors.disable}
                        width={27}
                        height={27}
                        right={true}
                        text_color={colors.disable}
                        url={"tel: " + ride.driver.phone}
                    />
                    : <Text/> 
                }
                </View>
            </View>
        );
    },

    renderText: function (text) {
        return (
            <Text style={styles.text_finalize}>
                    {text}
            </Text>
        )
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
        var top = this.renderSheetTop();   
        var avatar_twende = this.renderSheetTop(true, false); 
        var text = this.renderText("Request Time: "); 
        var text_no_response = this.renderText("Please cancel and find other rider or call support!"); 

        return (
            <View style={styles.page_ride}>
                <View style={styles.map_container}>
                    <Map
                        title= {"Connecting..."}
                        driver={ride.driver.position}
                        customer={ride.origin}
                    />
                </View>            
                {this.state.showMessage ? (
                    <View>
                        {top}
                        <View>
                            <View style={styles.text_box}>
                                <Text style={styles.customer_title}>
                                    {ride.driver.name}
                                </Text>
                                <Rating
                                    maxStars={5}
                                    showNumber={false}
                                    color={colors.grey}
                                    rating={ride.driver.rating}
                                    colorOn={colors.rating}
                                    colorOff={colors.action_disabled}
                                    size={20}
                                    style={styles.item}
                                />
                        <Text style={styles.text_important}>
                            {ride.driver_distance.distance} away
                        </Text>
                                <Text style={styles.text_timer}>
                                {text}
                            </Text>

                            <View style={styles.countdown_timer_container}>
                                <Timer 
                                    ms={600000} 
                                    style={styles.countdown_timer_view}
                                    textstyle={styles.countdown_timer}
                                />
                            </View>
                            </View>
                            <View style={styles.telephone_button}>
                                <SheetIcon
                                    url={"tel: " + ride.driver.phone}
                                    name={'phone'}
                                    size={23}
                                    text_color={colors.action}
                                    color={colors.white}
                                    width={30}
                                    height={30}
                                    backgroundColor={colors.action}
                                    text={"  CALL " + ride.driver.name.toUpperCase()}
                                    fontSize={15}
                                />
                            </View>
                        </View>
                    </View>
                ) : (
                    <View>
                    {avatar_twende}
                        <View>
                            <View style={styles.text_box}>
                                <Text style={styles.item_title}>
                                    Rider not Responding
                                </Text>
                                <View style={styles.timer}>
                                    {text_no_response}
                                </View>
                            </View>
                            <View style={styles.telephone_button}>
                                <SheetIcon
                                    url={"tel: 0791398120"}
                                    name={'phone'}
                                    size={23}
                                    text_color={colors.action}
                                    color={colors.white}
                                    width={30}
                                    height={30}
                                    backgroundColor={colors.action}
                                    text={"CALL SUPPORT"}
                                    fontSize={16}
                                />
                            </View>
                        </View>
                    </View>
                )}                        
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

    renderCanceled: function () {
        return (
            <View style={styles.loading}>
                <IconText
                    color={colors.action_secondary}
                    size={15}
                    icon={'settings-input-antenna'}
                    text={'Canceling ride. Please hang on as we search for nearby riders.'}
                />
            </View>
        );
    },
                                
    renderAccepted: function () {
        var ride = this.props.currentRide;
        var top = this.renderSheetTop();   
        var away = "Rider is on his way...";

        return (
            <View style={styles.page_ride}>
                <View style={styles.map_container}>
                    <Map
                        title={"rider on his way"}
                        driver={ride.driver.position}
                        customer={ride.origin}
                    />
                </View>
                {top}
                <View style={styles.text_box}>
                    <Text style={styles.item_title}>
                        Hi {ride.customer.first_name},
                    </Text>
                    <Text style={styles.text}>
                        {ride.driver.first_name} is on his way to pick you up!
                    </Text>
                </View>
                <View style={styles.telephone_button}>
                    <SheetIcon
                        url={"tel: " + ride.driver.phone}
                        name={'phone'}
                        size={23}
                        text_color={colors.action}
                        color={colors.white}
                        width={30}
                        height={30}
                        backgroundColor={colors.action}
                        text={"  CALL " + ride.driver.name.toUpperCase()}
                        fontSize={15}
                    />
                </View>
            </View>
        )
    },

    renderDriving: function () {
        var ride = this.props.currentRide;
        let text = "Twende!";
        var top = this.renderSheetTop(false);   

        return (
            <View style={styles.page_ride}>
                <View style={styles.map_container}>
                    <Map
                        style={{flex: 1}}
                        driver={ride.driver.position}
                        customer={ride.origin}
                    />
                </View>
                {top}
                <View style={styles.text_box}>
                    <Text style={styles.item_title}>
                        Hi {ride.customer.first_name},
                    </Text>
                     <Text style={styles.text}>
                        {text}
                    </Text>
                </View>
                <View style={styles.telephone_button}>
                    <SheetIcon
                        url={"tel: 0791398120"}
                        name={'phone'}
                        size={23}
                        text_color={colors.action}
                        color={colors.white}
                        width={30}
                        height={30}
                        backgroundColor={colors.action}
                        text={"CALL SUPPORT"}
                        fontSize={16}
                    />
                </View>
            </View>
        )
    },

    renderDropOff: function () {

        var ride = this.props.currentRide;

        return (
            <View style={styles.page_finalize}>   
                <View></View>
                <View style={styles.text_box}>
                    <Avatar/>
                        <Text style={styles.item_title}>
                            Ride Fare
                        </Text>

                        <Text style={styles.text_finalize}>
                            Your trip was {ride.distance.distance}
                        </Text>
                        <Text style={styles.heavy_text}>
                            {ride.ride_fare.amount} {ride.ride_fare.currency}
                        </Text>
                        <Line/>
                        <Text style={styles.text_finalize}>
                            Please choose:
                        </Text>
                    <View style={{flexDirection: 'row'}}>
                        <Button
                            style={styles.primary_buttons}
                            action={this.payMpesa}
                            text={"M-PESA"}
                            color={colors.action}
                            />
                        <Button
                            style={styles.primary_buttons}
                            action={this.payCash}
                            text={"CASH"}
                            color={colors.action}
                            />
                    </View>
                </View>
                <Banner/>
            </View>
        )
    },

    renderPayment: function () {
        var ride = this.props.currentRide;
        var text;

        if (ride.payment_method == 'mpesa') {
            var header = "M-Pesa Payment";
            text = "Choose Paybill Number: 653839" + "\n" + "Account No: Ride";
        } else {
            var header = "Cash Payment";
            var text = "Please pay the cash amount to rider";
        }

        return (
            <View style={styles.page_finalize}>   
                <View></View>
                <View style={styles.text_box}>
                    <Avatar/>
                    <Text style={styles.item_title}>
                        {header}
                    </Text>
                    <Text style={styles.heavy_text}>
                        {ride.fare}
                    </Text>
                    <Line/>
                   <Text style={styles.text_finalize}>
                        {text}
                    </Text>
                    <Button
                        style={styles.primary_button_finalize}
                        action={this.completePayment}
                        text={"FINALIZE"}
                        color={colors.action}
                    />
                </View>
                <Banner/>
            </View>
        )
    },


    renderFinalize: function () {
        var ride = this.props.currentRide;
        var driver = {};
        if (ride.driver) {
            driver = ride.driver
        }

        var message = "How was your ride with " + driver.name +"?";
        var header = "Rating";
        var buttonText = "FINISH";
        var buttonAction = this.finishRide;

        return (
            <View style={styles.page_finalize}>   
                <View></View>
                <View style={styles.text_box}>
                    <Avatar/>
                    <Text style={styles.item_title}>
                        {header}
                    </Text>
                    <Text style={styles.text_finalize}>
                        {message}
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
                        style={styles.primary_button_finalize}
                        text={"FINISH"}
                        color={colors.action}
                    />
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
                            <Text style={styles.text_finalize}>
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
            case 'canceled':
                content = this.renderCanceled();
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

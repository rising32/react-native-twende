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
var NavIcon = require('../Components/NavIcon');
import CurrentRideStore from '../Stores/CurrentRideStore';
import {
    refreshCurrentRide,
    updateCurrentRide } from "../Actions/CurrentRideActions";
import events from "../Constants/Events";
var SheetIcon = require('../Components/SheetIcon');
import StarRating from 'react-native-rating-star';


var CurrentRidePage = React.createClass({

    getInitialState: function () {
        return {
            currentUser: this.props.currentUser,
            currentRide: this.props.currentRide,
            driver: this.props.driver
        }

    },
    componentWillMount: function (props) {
        CurrentRideStore.removeAllListeners();
        CurrentRideStore.on(events.currentRideLoaded, this.rideLoaded);
        //refreshCurrentRide(this.state.currentRide.id);
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
        var currentRide = this.state.currentRide;
        switch (currentRide.state) {
            case 'new':
                currentRide.state = 'accepted';
                break;
            case 'accepted':
                currentRide.state = 'driving';
                break;
            case 'driving':
                currentRide.state = 'dropoff';
                break;
            case 'dropoff':
                currentRide.state = 'new';
                break;

        }
        this.setState({currentRide: currentRide});
        //refreshCurrentRide(this.state.currentRide);
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

    rate: function (value) {
        var ride = this.state.currentRide;
        ride.rating = value;
        this.setState({currentRide: ride});
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
                                How was your ride with {this.props.driver.name}
                            </Text>
                            <StarRating
                                maxStars={5}
                                rating={0}
                                selectStar={require('../assets/star-on.png')}
                                unSelectStar={require('../assets/star-off.png')}
                                valueChanged={this.rate}
                                starSize={30}
                                interitemSpacing={10}
                            />
                        </View>
                    </View>
                </View>
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
            default:
                content = this.renderConnecting();
                break;
        }
        return (
            <View style={styles.page}>
                {content}
                <View style={{alignItems: 'center'}}>
                    <Link
                        action={this.refreshRide}
                        color={colors.action_secondary}
                        text={"refresh status [" +  this.state.currentRide.state + "]"}
                        icon={"update"}
                        style={{margin: 10}}
                    />
                </View>
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

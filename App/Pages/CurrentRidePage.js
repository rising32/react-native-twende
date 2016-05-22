'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Text,
    Navigator,
    Image,
    TouchableOpacity,
    } = ReactNative;
import {colors, styles} from "../Styles";
import Avatar from "../Components/Avatar";
import { Icon } from 'react-native-material-design';
var StepBar = require('../Components/StepBar');
var Link = require('../Components/Link');
var NavIcon = require('../Components/NavIcon');
var NotifyAction = require('../Actions/NotifyActions');


var RequestRidePage = React.createClass({

    getInitialState: function() {
        return {
            currentUser: this.props.currentUser,
            currentRide: this.props.currentRide,
            driver: this.props.driver
        }

    },

    cancelRide: function() {
        alert('Ride Cancelled.');
        this.props.navigator.pop();
    },

    componentWillMount: function (props) {
        var title = "Driver has accepted";
        var message = `${this.state.driver.name}: I'm on my way...`;
        window.setTimeout(() => {
            NotifyAction.local(title, message);
        }, 5000)
    },


    fuzzyDistance: function() {
        let dist = this.state.driver.distance;
        if (dist > 1000) {
            return Math.round(dist / 100) / 10 + 'km';
        }
        return Math.round(dist)  + 'm';
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

    renderScene: function (route, navigator) {
        return (
            <View style={styles.page}>
                <StepBar />
                <View style={styles.sheet_dark}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Avatar image={this.props.currentUser.avatar} />
                        <Text style={{width: 90, textAlign: 'center', marginLeft: 20, marginRight: 20}}>
                            We're connecting you with {this.state.driver.name}
                        </Text>
                        <Avatar image={this.state.driver.avatar} />
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
        );
    }
});


var NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, nextState) {
        return (
            <NavIcon
                icon={"arrow-back"}
                action={() => {navigator.parentNavigator.pop()}}
            />
        );
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

module.exports = RequestRidePage;

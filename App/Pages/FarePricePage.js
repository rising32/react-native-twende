'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    View,
    Image,
    Alert,
    Text,
    ActivityIndicator,
    ToastAndroid,
    Navigator,
    TouchableHighlight,
    TouchableOpacity
    } = ReactNative;

const MapView = require('react-native-maps');
const CurrentRideActions = require('../Actions/CurrentRideActions');
const NavIcon = require('../Components/NavIcon');
const Button = require('../Components/Button');
const Link = require('../Components/Link');
const SheetIcon = require('../Components/SheetIcon');

import { loadGeoLocation } from "../Actions/GeoLocationActions";
import Avatar from "../Components/Avatar";
import Line from "../Components/Line";
import GeoLocationStore from '../Stores/GeoLocationStore';
import CurrentUserStore from '../Stores/CurrentUserStore';
import CurrentRideStore from '../Stores/CurrentRideStore';
import {colors, styles} from "../Styles";
import {
    createCurrentRide,
    loadRideList } from '../Actions/CurrentRideActions';
import events from "../Constants/Events";

const FarePricePage = React.createClass({

    renderAvatar: function (avatar) {
        return (
            <View style={styles.avatar_centre}>
                <Image
                    source={avatar}
                    style={styles.avatar}
                />
            </View>
        )
    },

    render: function () {


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

    renderScene: function (route, navigator) {
        var avatar = this.renderAvatar(require('../assets/twende_avatar.png'))
        
        return  (
            <View style={styles.page_finalize}>   
                <View></View>
                <View style={styles.text_box}>
                    {avatar}
                    <Text style={styles.item_title}>
                        Our Price
                    </Text>
                    <View style={styles.timer}>
                        <Text style={styles.text_finalize}>
                            Pick-up fee: 50 shilling 
                        </Text>
                    </View>
                    <View style={styles.timer}>
                        <Text style={styles.text_finalize}>
                            Kilometer price: 50 shilling
                        </Text>
                    </View>
                    <Line/>
                    <Text style={styles.text_finalize}>
                        The app keeps track of the kilometers.
                        At the end of the trip you can pay
                        with mobile money or cash
                    </Text>
                    <Text style={styles.text_finalize}>
                        {"\n"} Have a safe journey! 
                    </Text>
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
});

let NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, nextState) {
        return (
            <NavIcon
                icon={"arrow-back"}
                action={() => navigator.parentNavigator.pop()}
            />
        );
    },
    RightButton(route, navigator, index, nextState) {
        return null;
    },
    Title(route, navigator, index, nextState) {
        this.currentUser = CurrentUserStore.get();
        return (
            <Text style={styles.nav_title}>
                FARE ESTIMATION
            </Text>
        );
    }
};

module.exports = FarePricePage;
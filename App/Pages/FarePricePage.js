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
import GeoLocationStore from '../Stores/GeoLocationStore';
import CurrentUserStore from '../Stores/CurrentUserStore';
import CurrentRideStore from '../Stores/CurrentRideStore';
import {colors, styles} from "../Styles";
import {
    createCurrentRide,
    loadRideList } from '../Actions/CurrentRideActions';
import events from "../Constants/Events";

const FarePricePage = React.createClass({

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
                <View style={[styles.card_mid_finalize, {padding: 40}]}>
                    <View style={{flexDirection: 'row', justifyContent: 'center', elevation: 5}}>
                        <Avatar image={this.props.currentUser.avatar}/>
                    </View>
                    <Text style={[styles.item_title, {textAlign: 'center'}]}>
                        This is our price
                    </Text>
                    <Text style={styles.text_card_mid}>
                        Pick-up fee: 60 shilling
                    </Text>
                    <Text style={styles.text_card_mid}>
                        Kilometer price: 50 shilling
                    </Text>
                    <Text style={styles.text_card_mid}>
                        The app keeps track of the kilometers.
                        At the end of the trip you can pay
                        with mobile money or cash
                    </Text>
                    <Text style={styles.text_card_mid}>
                        Have a good ride!
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
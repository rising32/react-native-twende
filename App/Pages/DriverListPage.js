'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Text,
    Navigator,
    ListView,
    ToastAndroid,
    } = ReactNative;

var DriverActions = require('../Actions/DriverActions');
var GeoLocationStore = require('../Stores/GeoLocationStore');
var DriverItem = require('../Components/DriverItem');
import {colors, styles} from "../Styles";
var RefreshableListView = require('../Components/RefreshableListView');
var NavIcon = require('../Components/NavIcon');
var IconText = require('../Components/IconText');
var Link = require('../Components/Link');
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import events from "../Constants/Events";
import DriverStore from '../Stores/DriverStore';
import CurrentRideStore from '../Stores/CurrentRideStore';
import { loadDriverList } from '../Actions/DriverActions';
import { updateCurrentRide } from '../Actions/CurrentRideActions';


var DriverListPage = React.createClass({

    getInitialState: function () {
        return {
            currentUser: this.props.currentUser,
            currentRide: this.props.currentRide,
            driver: {},
            items: [],
            isLoading: true,
            isConnecting: false
        };
    },

    componentDidMount: function () {
        DriverStore.on(events.driverListLoaded, this.setItems);
        CurrentRideStore.on(events.currentRideLoaded, this.nextStep);
        this.refreshItems();
    },

    componentWillUnmount: function () {
        DriverStore.removeListener(events.driverListLoaded, this.setItems);
        CurrentRideStore.removeListener(events.currentRideLoaded, this.nextStep);

    },

    setItems: function(items) {
        this.setState({
            items: items,
            isLoading: false
        });
    },

    refreshItems: function() {
        ToastAndroid.show("Refreshing list", ToastAndroid.SHORT)
        loadDriverList(this.state.currentRide.origin);
    },

    selectDriver: function (driver) {
        var currentRide = this.state.currentRide;
        currentRide.driver = driver;
        currentRide.destination = currentRide.origin;
        this.setState({
            currentRide: currentRide,
            driver: driver,
            isConnecting: true
        });
        updateCurrentRide(currentRide);
        this.props.navigator.push({id: 'CurrentRidePage', currentRide: currentRide, driver: driver});
    },

    nextStep: function(currentRide) {
        this.props.navigator.push({id: 'CurrentRidePage', currentRide: currentRide, test: 'testies'});
    },

    getDataSource: function (items:Array<any>):ListView.DataSource {
        return this.state.items.cloneWithRows(items);
    },

    render: function () {
        return (
            <Navigator
                renderScene={this.renderScene}
                navigator={this.props.navigator}
                navigationBar={
                    <Navigator.NavigationBar
                        style={styles.nav_bar}
                        routeMapper={NavigationBarRouteMapper}
                    />
                }
            />
        );
    },

    renderItem: function (item, sectionId, rowId) {
        return (
            <DriverItem
                key={"item" + rowId}
                driver={item}
                onSelect={() => this.selectDriver(item)}
                onHighlight={() => this.highLightRow(sectionId, rowId)}
                onUnhighlight={() => this.highLightRow(null, null)}
            />
        );
    },

    renderItems: function () {
        return (
            <RefreshableListView
                style={styles.list}
                ref="listview"
                minDisplayTime={2}
                minPulldownDistance={20}
                dataSource={ds.cloneWithRows(this.state.items)}
                renderRow={this.renderItem}
                loadData={this.refreshItems}
                refreshDescription="Refreshing drivers"
            />

        )
    },


    renderEmpty: function () {
        return (
            <View>
                <Text>
                    No riders found
                </Text>
            </View>
        );
    },

    renderLoading: function () {
        return (
            <View style={styles.loading}>
                <IconText
                    color={colors.action_secondary}
                    size={16}
                    icon={'settings-input-antenna'}
                    text={'Loading drivers. Hang on...'}
                />
            </View>
        );
    },

    renderScene: function (route, navigator) {
        var content;
        var spinner;
        if (this.state.isConnecting) {
            spinner = (
                <View style={styles.spinner}>
                    <Text>Connecting...</Text>
                </View>
            );
        }
        var footer = (
            <Link
                action={this.refreshItems}
                color={colors.action_secondary}
                text={"refresh list"}
                icon={"update"}
                style={{margin: 10}}
            />
        );
        if (this.state.isLoading) {
            content = this.renderLoading();
            footer = null;
        } else if (this.state.items.length === 0) {
            content = this.renderEmpty();
        } else {
            content = this.renderItems();
        }

        return (
            <View style={styles.page}>
                {content}
                {spinner}
                <View style={{alignItems: 'center'}}>
                    {footer}
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
                action={() => {navigator.parentNavigator.push({id: 'CurrentLocationPage'})}}
            />
        );
    },
    RightButton(route, navigator, index, nextState) {
        return null;
    },
    Title(route, navigator, index, nextState) {
        return (
            <Text style={styles.nav_title}>
                CLOSEST RIDERS
            </Text>
        );
    }
};


module.exports = DriverListPage;

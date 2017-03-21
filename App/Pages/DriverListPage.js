'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,   
    Text,
    Navigator,
    ActivityIndicator,
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
            animating: true,
            items: [],
            isLoading: true,
            isConnecting: false
        };
    },

    componentDidMount: function () {
        DriverStore.on(events.driverListLoaded, this.setItems);
        this.refreshItems();
        this.setToggleTimeout(); 
    },

    componentWillUnmount: function () {
        DriverStore.removeListener(events.driverListLoaded, this.setItems);
        clearTimeout(this._timer);
    },

    setToggleTimeout: function() { 
        this._timer = setTimeout(() => { 
            this.setState({ animating: false });
            this.setToggleTimeout(); 
        }, 2000); 
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
        currentRide.state = 'requested';
        this.setState({
            currentRide: currentRide,
            isConnecting: true
        });
        updateCurrentRide(currentRide);
    },

    getDataSource: function (items:Array<any>):ListView.DataSource {
        return this.state.items.cloneWithRows(items);
    },

    back: function(){
        var ride = this.props.currentRide;
        ride.state = 'canceled';
        updateCurrentRide(ride);
    },

    render: function () {
        return (
            <Navigator
                renderScene={this.renderScene}
                navigator={this.props.navigator}
                back={this.back}
                navigationBar={
                    <Navigator.NavigationBar
                        style={styles.nav_bar}
                        routeMapper={{
                            LeftButton: (route, navigator, index, navState) => {
                                return (
                                    <NavIcon
                                        icon={"arrow-back"}
                                        action={this.back}
                                    />
                                );
                            },
                            RightButton: () =>{},
                            Title: (route, navigator, index, navState) => {
                                return (
                                    <Text style={styles.nav_title}>
                                        CLOSEST RIDERS
                                    </Text>
                                );
                            }
                        }}
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
                    text={'Loading riders. Hang on...'}
                />
            </View>
        );
    },

    renderScene: function (route, navigator) {
        var content;
        var spinner;
        if (this.state.isConnecting) {
            spinner = (
                <View style={[styles.activity_indicator, {left: 150, bottom: 275}]}>
                    <ActivityIndicator 
                    size={80}
                    color={colors.disable} 
                    /> 
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



module.exports = DriverListPage;

'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Text,
    View,
    TouchableHighlight
    } = ReactNative;
var MapView = require('react-native-maps');
import {colors, styles} from "../Styles";
import { Icon } from 'react-native-material-design';


var Map = React.createClass({

    getInitialState: function () {
        var lat = this.props.customer.latitude || this.props.driver.latitude || -1.283333;
        var long = this.props.customer.longitude || this.props.driver.longitude || 36.816667;
        var latDelta = 0.015;
        var longDelta = 0.015;
        if (this.props.driver.latitude && this.props.customer.latitude) {
            latDelta = Math.abs(3 * (this.props.driver.latitude - this.props.customer.latitude));
            longDelta =  Math.abs(3 * (this.props.driver.longitude - this.props.customer.longitude));
        }
        return {
            region: {
                latitude: lat,
                longitude: long,
                latitudeDelta: latDelta,
                longitudeDelta: longDelta
            }
        }
    },

    render: function () {
        var driver;
        var customer;
        var title = this.props.title || 'map'

        if (this.props.driver) {
            driver =  <MapView.Marker
                        draggable
                        ref="rider"
                        title="Rider"
                        pinColor="yellow"
                        image={require('../assets/map-motor1.png')}
                        coordinate={this.props.driver}
                    />
        }
        if (this.props.customer) {
            customer =  <MapView.Marker
                        draggable
                        ref="customer"
                        title="Customer"
                        description="Pick-up location"
                        pinColor="yellow"
                        image={require('../assets/map-customer.png')}
                        coordinate={this.props.customer}
                        style={styles.marker}
                        onDragEnd={(e) => this.dragOrigin(e.nativeEvent.coordinate)}
                    />
        }

        return (
            <View style={styles.map_container}>
                <MapView
                    region={this.state.region}
                    ref="map"
                    mapType="standard"
                    showsUserLocation={true}
                    showUserLocation={true}
                    onRegionChange={this.onRegionChange}
                    style={styles.map}>
                    {driver}
                    {customer}
                 </MapView>
            </View>
        );
    }
});

module.exports = Map;
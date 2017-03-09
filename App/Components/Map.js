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
        var lat = this.props.customer.latitude || this.props.driver.latitude || -1.23825
        var long = this.props.customer.longitude || this.props.driver.longitude || 35.89125;
        return {
            region: {
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }
        }
    },

    componentDidMount: function(){
        setTimeout(() => {
            this.refs.map.fitToElements(true);
        }, 2000);
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
                        onDragEnd={(e) => this.dragOrigin(e.nativeEvent.coordinate)}
                    />
        }

        return (
            <View style={styles.map_container}>
                <MapView
                    region={this.state.region}
                    ref="map"
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


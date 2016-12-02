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
        return {
            origin: {
                latitude: -1.23825,
                longitude: 35.8724
            },
            region: {
                latitude: -1.23825,
                longitude: 35.8724,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
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
                        pinColor="yellow"
                        image={require('../assets/map-motor1.png')}
                        coordinate={this.props.driver}
                    />
        }
        if (this.props.customer) {
            customer =  <MapView.Marker
                        draggable
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
                    showsUserLocation={true}
                    onRegionChange={this.onRegionChange}
                    showUserLocation={true}
                    style={styles.map}>
                    {driver}
                    {customer}
                </MapView>
                <View style={styles.map_info}>
                    <Text />
                    <View style={styles.map_info_container}>
                        <Text style={styles.map_title}>
                            {title}
                        </Text>
                    </View>

                    <TouchableHighlight
                        onPress={this.refreshLocation}
                        style={styles.map_info_action}
                    >
                        <View>
                            <Icon name="gps-fixed" size={24} color={colors.action_secondary} />
                        </View>
                    </TouchableHighlight>

                </View>
            </View>
        );
    }
});

module.exports = Map;

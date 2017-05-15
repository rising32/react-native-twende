'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Text,
    View,
    Image,
    TouchableOpacity
    } = ReactNative;

import {colors, styles} from "../Styles";
import Avatar from "../Components/Avatar";
var IconText = require('../Components/IconText');


var Drawer = React.createClass({
    render: function () {
        return (
            <View>
                    <Avatar 
                        image={this.state.currentUser.avatar}
                        justify={justify}
                    />
                <View style={{padding:10}}>
                    <Text>
                        {this.state.currentUser.name}
                    </Text>
                </View>
                <View style={{backgroundColor: '#555555', padding: 8, flex: 1}}>
                    <Link
                        style={{padding: 8}}
                        //action={() => navigator.push({id: 'ProfilePage'})}
                        action={() => console.log(this.props)}
                        size={14}
                        color={'#DDDDDD'}
                        icon={'account-circle'}
                        text={'My Profile'}
                    />
                    <IconText
                        style={{padding: 8}}
                        size={14}
                        color={'#DDDDDD'}
                        icon={'favorite'}
                        text={'My Favourite Drivers'}
                    />
                    <IconText
                        style={{padding: 8}}
                        size={14}
                        color={'#DDDDDD'}
                        icon={'history'}
                        text={'My Ride History'}
                    />
                    <IconText
                        style={{padding: 8}}
                        size={14}
                        color={'#DDDDDD'}
                        icon={'people'}
                        text={'Invite Friends'}
                    />
                    <Link
                        action={this.logout}
                        style={{padding: 8}}
                        size={14}
                        color={'#DDDDDD'}
                        icon={'power-settings-new'}
                        text={'Logout'}
                    />

                </View>

            </View>
        )
    }
});

module.exports = Drawer;

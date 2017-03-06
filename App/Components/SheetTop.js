
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    TouchableOpacity
    } = ReactNative;
import { Icon } from 'react-native-material-design';
import {colors, styles} from "../Styles";
import Avatar from "../Components/Avatar";
var IconText = require('../Components/IconText');
var Iconed = require('../Components/Iconed');
var SheetIcon = require('../Components/SheetIcon');

var SheetTop = React.createClass({

    render: function () {


            return (
                <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-between', marginTop: -50, marginBottom: -15, elevation: 5}}>

                            <Text style={{fontSize: 15, color: colors.disable}}>
                                refresh
                            </Text>

                    <View style={{marginLeft: 10, marginRight: 14}}>
                        <Text> test </Text>
                    </View>
                    <Text style={{fontSize: 15, color: colors.disable}}>
                        hoi
                    </Text>
                </View>
            );
        }
});

module.exports = SheetTop;

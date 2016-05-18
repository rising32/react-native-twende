'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    TouchableOpacity
    } = ReactNative;
import {colors, styles} from "../Styles";
import { Icon } from 'react-native-material-design';


var SheetIcon = React.createClass({

    render: function () {
        return (
            <View style={{alignItems: 'flex-end', marginTop: -45, elevation: 5}}>
                <TouchableOpacity onPress={this.props.action}>
                    <View style={{borderRadius: 25, backgroundColor: colors.action, width: 50, height: 50, alignItems: 'center', paddingTop: 10}}>
                        <Icon
                            name={this.props.icon}
                            size={30}
                            color={'#ffffff'}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
});

module.exports = SheetIcon;

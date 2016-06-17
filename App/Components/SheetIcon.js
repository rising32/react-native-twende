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
        var align = this.props.align ? this.props.align : 'flex-end';
        var color = this.props.color ? this.props.color : colors.action;
        return (
            <View style={{alignItems: align, marginTop: -45, marginBottom: -15, elevation: 5}}>
                <TouchableOpacity onPress={this.props.action}>
                    <View style={[styles.sheet_icon, {backgroundColor: color}]}>
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

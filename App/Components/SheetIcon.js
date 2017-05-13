'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Text,
    TouchableOpacity
    } = ReactNative;
import {colors, styles} from "../Styles";
import { Icon } from 'react-native-material-design';


module.exports = React.createClass({

    render: function () {
        const align = this.props.align ? this.props.align : 'flex-end';
        const color = this.props.color ? this.props.color : colors.secondary;

        const icon = (
            <View style={[styles.sheet_icon_icon, {backgroundColor: color}]}>
                <Icon
                    name={this.props.icon}
                    size={18}
                    color={'#ffffff'}
                />
            </View>
        );
        const link = (
            <Text style={[styles.sheet_icon_text, {color: color}]}>
                {this.props.text}
            </Text>
        );
        if (align == 'flex-end') {
            return (
                <View style={[styles.sheet_icon, {alignItems: align}]}>
                    <TouchableOpacity onPress={this.props.action} style={{flexDirection: 'row', alignItems: 'center'}}>
                        {link}
                        {icon}
                    </TouchableOpacity>
                </View>
            );
        }
        return (
            <View style={[styles.sheet_icon, {alignItems: align}]}>
                <TouchableOpacity onPress={this.props.action} style={{flexDirection: 'row', alignItems: 'center'}}>
                    {icon}
                    {link}
                </TouchableOpacity>
            </View>
        );
    }
});

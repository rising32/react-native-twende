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


var SheetIcon = React.createClass({

    render: function () {
        var align = this.props.align ? this.props.align : 'flex-end';
        var color = this.props.color ? this.props.color : colors.secondary;
        return (
            <View style={[{alignItems: align, marginLeft: 10, marginTop: 28, marginBottom: -15, elevation: 5}, this.props.style]}>
                <TouchableOpacity onPress={this.props.action} style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={[styles.sheet_icon, {backgroundColor: color}]}>
                        <Icon
                            name={this.props.icon}
                            size={18}
                            color={'#ffffff'}
                        />
                    </View>
                    <Text style={{fontFamily: 'gothamrounded_bold', fontSize: 12, color: colors.secondary, marginLeft: 4, marginTop: 0}}>
                        {this.props.text}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
});



module.exports = SheetIcon;

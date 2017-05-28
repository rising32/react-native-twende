'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Text,
    View,
    } = ReactNative;
import {colors, styles} from "../Styles";
import { Icon } from 'react-native-material-design';


var IconText = React.createClass({

    render: function () {
        var text = this.props.text || '';
        var color = this.props.color || colors.action;
        var size = this.props.size || 16;
        var iconSize = this.props.iconSize ? this.props.iconSize : size;
        var icon = null;
        if (this.props.icon) {
            icon = <Icon name={this.props.icon}
                         color={color}
                         size={iconSize}
                         style={{marginRight: iconSize/2}} />
        }

        return (
            <View
                style={[this.props.style, {flexDirection: 'row', alignItems: 'center'}]}
            >
                {icon}
                <View style={styles.link}>
                    <Text style={{color: color, fontSize: size, fontFamily: 'gothamrounded_medium' }}>
                        {text}
                    </Text>
                </View>
            </View>
        );
    }
});

module.exports = IconText;
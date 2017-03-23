'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Linking,
    Text,
    TouchableOpacity,
    TouchableNativeFeedback,
    View,
    } = ReactNative;
import {colors, styles} from "../Styles";
import { Icon } from 'react-native-material-design';


var Link = React.createClass({

    propTypes: {
        url: React.PropTypes.string
    },

    handleClick: function () {
        Linking.canOpenURL(this.props.url).then(supported => {
            if (supported) {
                Linking.openURL(this.props.url);
            } else {
                console.log('Don\'t know how to open URI: ' + this.props.url);
            }
        });
    },

    render: function () {
        var text = this.props.text || '';
        var color = this.props.color || colors.action;
        var size = this.props.size || 16;
        var iconSize = this.props.iconSize ? this.props.iconSize : size;
        var textAlign = this.props.textAlign || 'right';
        var icon = null;
        var iconRight = null;
        var action = this.props.action ? this.props.action : this.handleClick
        if (this.props.icon) {
            icon = <Icon name={this.props.icon}
                        fontFamily={'gothamrounded_book'}
                        color={color}
                        size={iconSize}
                        style={{marginRight: iconSize/2}} />
        }
        if (this.props.iconRight) {
            iconRight = <Icon name={this.props.iconRight}
                         color={color}
                         size={iconSize}
                         style={{marginRight: iconSize/2}} />
        }
        
        return (
            <TouchableOpacity
                onPress={action}
                style={[this.props.style, {flexDirection: 'row', alignItems: 'center'}]}
            >
                {icon}
                <View style={styles.link}>
                    <Text style={[this.props.textStyle, {color: color, fontSize: size, textAlign: textAlign}]}>
                        {text}
                    </Text>
                </View>
                {iconRight}
            </TouchableOpacity>
        );
    }
});

module.exports = Link;

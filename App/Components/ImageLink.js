'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Linking,
    Text,
    Image,
    TouchableOpacity,
    TouchableNativeFeedback,
    View,
    } = ReactNative;
import {colors, styles} from "../Styles";

var ImageLink = React.createClass({

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
        var imagestyle = this.props.imagestyle;
        var source = this.props.source;
        var iconSize = this.props.iconSize ? this.props.iconSize : size;
        var textAlign = this.props.textAlign || 'right';
        var image;
        var fontFamily = this.props.fontFamily || 'gothamrounded_book';
        var action = this.props.action ? this.props.action : this.handleClick

        if (this.props.source) {
            image = <Image
                        source={source}
                        style={imagestyle}
                    />
        }
        
        return (
            <TouchableOpacity
                onPress={action}
                style={[this.props.style, {flexDirection: 'row', alignItems: 'center'}]}
            >
                
                <View style={styles.link}>
                    <Text style={[this.props.textStyle, {fontFamily: fontFamily, color: color, fontSize: size, textAlign: textAlign}]}>
                        {text}
                    </Text>
                </View>
                {image}
            </TouchableOpacity>
        );
    }
});

module.exports = ImageLink;

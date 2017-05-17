'use strict';
import React from "react"
var ReactNative = require('react-native');
var {
    Linking,
    View,
    Text,
    TouchableOpacity
    } = ReactNative;
import {colors, styles} from "../Styles";
import { Icon } from 'react-native-material-design';


module.exports = React.createClass({

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
        var action = this.props.action ? this.props.action : this.handleClick
        var borderRadius = this.props.borderRadius ? this.props.borderRadius : 15

        if (this.props.right) {
            return (
                <TouchableOpacity onPress={action} style={styles.horizontal}>
                    <Text style={[styles.sheet_icon_text, {color: this.props.text_color, fontSize: this.props.fontSize}]}>
                        {this.props.text}
                    </Text>
                    <View style={[styles.sheet_icon, {alignItems: this.props.align}]}>
                        <View style={[styles.sheet_icon_icon, {backgroundColor: this.props.backgroundColor, width: this.props.width, height: this.props.height}]}>
                            <Icon
                                name={this.props.name}
                                size={this.props.size} 
                                color={this.props.color}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        } 

            return (
                <TouchableOpacity onPress={action} style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={[styles.sheet_icon, {alignItems: this.props.align}]}>
                        <View style={[styles.sheet_icon_icon, {backgroundColor: this.props.backgroundColor, borderRadius: borderRadius, width: this.props.width, height: this.props.height}]}>
                            <Icon
                                name={this.props.name}
                                size={this.props.size} 
                                color={this.props.color}
                            />
                        </View>
                        <Text style={[styles.sheet_icon_text, {color: this.props.text_color, fontSize: this.props.fontSize}]}>
                            {this.props.text}
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        }
    })

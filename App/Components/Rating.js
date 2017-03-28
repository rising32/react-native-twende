'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Text
    } = ReactNative;

import { Icon } from 'react-native-material-design';
import {colors, styles} from "../Styles";


var Rating = React.createClass({

    propTypes: {
        disabled: React.PropTypes.bool,
        maxStars: React.PropTypes.number,
        rating: React.PropTypes.number,
        onChange: React.PropTypes.func,
        style: View.propTypes.style,
        size: React.PropTypes.number,
        colorOn: React.PropTypes.string,
        colorOff: React.PropTypes.string,
        icon: React.PropTypes.string
    },

    defaultProps: {
        disabled: true,
        maxStars: 5,
        rating: 0
    },

    render: function() {
        const ratingRound = Math.round(this.props.rating);
        const rating = this.props.rating ? this.props.rating : '?';
        const maxStars = this.props.maxStars;
        const starButtons = [];
        const colorOn = this.props.colorOn ? this.props.colorOn : styles.colorOn;
        const colorOff = this.props.colorOff ? this.props.colorOff : styles.colorOff;
        const icon = this.props.icon ? this.props.icon : 'grade';
        const size = this.props.size ? this.props.size : 20;
        for (let i = 0; i < maxStars; i++) {
            const starColor = (i + 1) <= ratingRound ? colorOn : colorOff;
            starButtons.push(
                <Icon name={icon}
                      key={'start-' + i}
                     color={starColor}
                     size={size} />
            );
        }
        return (
            <View style={[styles.starRatingContainer]}>
                {starButtons}
                <Text style={{color: colors.secondary, fontFamily: 'gothamrounded_medium', fontSize: 12, marginLeft: 4}}>{rating}</Text>
            </View>
        );
    }
});


module.exports = Rating;
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    TouchableOpacity,
    } = ReactNative;

import { Icon } from 'react-native-material-design';


var StarRating = React.createClass({

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

    getInitialState: function() {
        const roundedRating = (Math.round(this.props.rating));
        return {
            maxStars: this.props.maxStars,
            rating: roundedRating
        }
    },

    pressStarButton: function(rating) {
        if (!this.props.disabled) {
            if (rating != this.state.rating) {
                if (this.props.onChange) {
                    this.props.onChange(rating);
                }
                this.setState({
                    rating: rating
                });
            }
        }
    },

    render: function() {
        const rating = this.state.rating;
        const maxStars = this.state.maxStars;
        const starButtons = [];
        const colorOn = this.props.colorOn ? this.props.colorOn : styles.colorOn;
        const colorOff = this.props.colorOff ? this.props.colorOff : styles.colorOff;
        const icon = this.props.icon ? this.props.icon : 'grade';
        const size = this.props.size ? this.props.size : 30;
        for (let i = 0; i < maxStars; i++) {
            const starColor = (i + 1) <= rating ? colorOn : colorOff;
            starButtons.push(
                <TouchableOpacity
                    activeOpacity={0.20}
                    key={'star-' + (i + 1)}
                    onPress={this.pressStarButton.bind(this, (i + 1))}
                >
                    <Icon name={icon}
                         color={starColor}
                         size={size} />
                </TouchableOpacity>
            );
        }
        return (
            <View style={[styles.starRatingContainer]}>
                {starButtons}
            </View>
        );
    }
});

const styles = StyleSheet.create({
    starRatingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    colorOn: {
        color: '#FF4946'
    },
    colorOff: {
        color: '#999999'
    }
});

module.exports = StarRating;
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Text,
    View,
    ListView
    } = ReactNative;

import {colors, styles} from "../Styles";
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import * as Progress from 'react-native-progress';


var Circle = React.createClass({
    render: function () {
        var dot;

        if (this.props.done) {
            dot = (
                <View
                    style={{
                        borderRadius: 25,
                        backgroundColor: colors.action,
                        width: 26,
                        height: 26,
                        marginTop: 8
                    }}
                />
            )
        } else if (this.props.in_progress) {
            dot = (
                <Progress.CircleSnail
                    size={42}
                    thickness={8}
                    color={colors.action}
                />
            )
        } else  {
            dot = (
                <View
                    style={{
                        borderRadius: 25,
                        backgroundColor: '#cccccc',
                        width: 12,
                        height: 12,
                        marginTop: 15
                    }}
                />
            )
        }

        return (

            <View
                style={{borderRadius: 25,
                        backgroundColor: '#eeeeee',
                        width: 50,
                        height: 50,
                        margin: 1,
                        alignItems: 'center',
                        padding: 4

                }}
            >
                {dot}
            </View>
        );
    }
});

var StepBar = React.createClass({

    renderStep: function (item, sectionId, rowId) {
        return (
            <View style={styles.step}>
                <Circle in_progress={item.in_progress} done={item.done} />
                <Text style={styles.step_title}>
                    {item.title}
                </Text>
            </View>
        )
    },

    render: function () {
        return (
            <ListView
                contentContainerStyle={styles.step_bar}
                ref="listview"
                dataSource={ds.cloneWithRows(this.props.steps)}
                renderRow={this.renderStep}
            />
        )
    }
});

module.exports = StepBar;

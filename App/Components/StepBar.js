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


var Circle = React.createClass({
    render: function () {
        var color = this.props.on ? colors.action : '#eeeeee';

        return (

            <View
                style={{borderRadius: 25,
                        backgroundColor: '#eeeeee',
                        width: 50,
                        height: 50,
                        margin: 1,
                        alignItems: 'center'

                }}
            >
                <View
                    style={{borderRadius: 15,
                            backgroundColor: color,
                            width: 24,
                            height: 24,
                            alignItems: 'center',
                            marginTop: 13
                    }}
                >
                    <View
                        style={{borderRadius: 5,
                                backgroundColor: '#cccccc',
                                width: 10,
                                height: 10,
                                marginTop: 7
                        }}
                    />
                </View>
            </View>
        );
    }
});

var StepBar = React.createClass({

    renderStep: function (item, sectionId, rowId) {
        return (
            <View style={styles.step}>
                <Circle on={item.on}/>
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

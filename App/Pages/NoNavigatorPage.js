'use strict';

var ReactNative = require('react-native');
var {
  View,
  Text,
  TouchableOpacity,
} = ReactNative;

var React = require('react');
var {
  Component,
} = React;

class NoNavigatorPage extends Component {
  render() {
    var navigator = this.props.navigator;
    return (
      <View style={{backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity
          onPress={() => navigator.pop()}>
          <Text style={{color: 'white'}}>
              Dit is een dingetje voor erover....
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

module.exports = NoNavigatorPage;

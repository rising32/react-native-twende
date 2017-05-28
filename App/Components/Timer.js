import React, { Component } from 'react';
import { View, Text } from 'react-native';
import TimerMixin from 'react-timer-mixin'
import {colors, styles} from "../Styles";

export default class Timer extends Component {

  constructor(props) {
      super();
      this.state = {
        milliSeconds: props.ms / 1000,
        expired: false
      }
      this.expired = this.expired.bind(this)
  }

  componentWillUnmount () {
    TimerMixin.clearTimeout(this.timer)
  }

  componentDidMount () {
    this.timer = TimerMixin.setInterval(() => {
      this.state.milliSeconds = this.state.milliSeconds - 1
      this.state.milliSeconds > 0 ? this.setState({milliSeconds: this.state.milliSeconds, expired: this.state.expired}) : this.expired()
    }, 1000)
  }

  render () {
    const minutes = parseInt(this.state.milliSeconds / 60) < 10 ? '0' + parseInt(this.state.milliSeconds / 60) : parseInt(this.state.milliSeconds / 60)
    const seconds = this.mod(this.state.milliSeconds, 60) < 10 ? '0' + this.mod(this.state.milliSeconds, 60) : this.mod(this.state.milliSeconds, 60)
    const time = `${seconds}`

    return (
      <View style={this.props.style}>
        <Text style={this.props.textStyle}>{time}</Text>
      </View>
    );

  }
  expired () {
    this.setState({milliSeconds: 0, expired: true})
    TimerMixin.clearTimeout(this.timer)
    if(this.props.expired) this.props.expired()
  }
  // mod function including negative numbers -1%60 = 59
  mod = (n, m) => ((n % m) + m) % m
}

Timer.propTypes = {
  action: React.PropTypes.func,
  ms: React.PropTypes.number.isRequired
}

Timer.defaultProps = {
  ms: 0
}



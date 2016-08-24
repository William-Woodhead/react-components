import React, { Component, PropTypes } from 'react';
import TimeSelect from '../time-select';

const ROOT = 'TimeRange';
const DIVIDER = 'TimeRange-divider';
const DIVIDER_TEXT = 'TimeRange-divider-text';

export default class TimeRange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.timeRange
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ ...newProps.timeRange });
  }

  onRangeChange() {
    const { startHour, startMinute, endHour, endMinute } = this.state;
    this.props.onRangeChange({ startHour, startMinute, endHour, endMinute });
  }

  onStartTimeSelect(time) {
    this.setState({
      startHour: time.hour,
      startMinute: time.minute
    }, () => {
      this.onRangeChange();
    });
  }

  onEndTimeSelect(time) {
    this.setState({
      endHour: time.hour,
      endMinute: time.minute
    }, () => {
      this.onRangeChange();
    });
  }

  render() {
    return (
      <span ref="root" className={ROOT}>
        <TimeSelect ref="start" time={{ hour: this.state.startHour, minute: this.state.startMinute }} onTimeSelect={::this.onStartTimeSelect} />
        <div className={DIVIDER}><span className={DIVIDER_TEXT}>to</span></div>
        <TimeSelect ref="end" time={{ hour: this.state.endHour, minute: this.state.endMinute }} onTimeSelect={::this.onEndTimeSelect} />
      </span>
    );
  }
}

TimeRange.defaultProps = {
  onRangeChange: par => par,
  timeRange: {
    id: null,
    startHour: 0,
    startMinute: 0,
    endHour: 0,
    endMinute: 0
  }
};

TimeRange.propTypes = {
  timeRange: PropTypes.object,
  onRangeChange: PropTypes.func
};

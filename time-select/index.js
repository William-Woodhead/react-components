import React, { Component, PropTypes } from 'react';
import { times } from './times';
import TagSelect from '../tag-select';
import padStart from 'lodash/padStart';
import isFunction from 'lodash/isFunction';

export default class TimeSelect extends Component {
  onTimeSelect(time) {
    if (time) {
      this.props.onTimeSelect(parseTime(time));
    }
  }

  render() {
    return (
      <span ref="root" className="TimeSelect">
        <TagSelect
          ref="tagSelect"
          placeholder="Time"
          tags={getTimeIdFromMoment(this.props.time)}
          options={times}
          onSubmit={::this.onTimeSelect}
          singleTagMode
        />
      </span>
    );
  }
}

function getTimeIdFromMoment(mo) {
  const hourIsFunc = isFunction(mo.hour);
  const minuteIsFunc = isFunction(mo.minute);
  return `${padStart((hourIsFunc ? mo.hour() : mo.hour), 2, '0')}:${padStart((minuteIsFunc ? mo.minute() : mo.minute), 2, '0')}`;
}

function parseTime(time) {
  return {
    hour: time ? parseInt(time.id.split(':')[0], 10) : 0,
    minute: time ? parseInt(time.id.split(':')[1], 10) : 0
  };
}

TimeSelect.defaultProps = {
  onTimeSelect: par => par,
  time: {
    hour: 0,
    minute: 0
  }
};

TimeSelect.propTypes = {
  time: PropTypes.object,
  onTimeSelect: PropTypes.func
};

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import TimeRange from '../index';
import expect from 'expect';

describe('The time range component', () => {
  describe('When initialised', () => {
    it('should set the initial state', () => {
      const result = TestUtils.renderIntoDocument(<TimeRange />);
      expect(result.state).toEqual({
        id: null,
        startHour: 0,
        startMinute: 0,
        endHour: 0,
        endMinute: 0
      });
    });
  });

  describe('When the start time is selected', () => {
    it('should set the start state', () => {
      const result = TestUtils.renderIntoDocument(<TimeRange />);
      result.refs.start.props.onTimeSelect({
        hour: 1,
        minute: 30
      });
      expect(result.state.startHour).toBe(1);
      expect(result.state.startMinute).toBe(30);
    });

    it('should call the on range change prop', () => {
      const spy = expect.createSpy();
      const result = TestUtils.renderIntoDocument(<TimeRange onRangeChange={spy}/>);
      result.refs.start.props.onTimeSelect({
        hour: 1,
        minute: 30
      });
      expect(spy).toHaveBeenCalledWith({
        startHour: 1,
        startMinute: 30,
        endHour: 0,
        endMinute: 0
      });
    });
  });

  describe('When the end time is selected', () => {
    it('should set the end state', () => {
      const result = TestUtils.renderIntoDocument(<TimeRange />);
      result.refs.end.props.onTimeSelect({
        hour: 3,
        minute: 50
      });
      expect(result.state.endHour).toBe(3);
      expect(result.state.endMinute).toBe(50);
    });

    it('should call the on range change prop', () => {
      const spy = expect.createSpy();
      const result = TestUtils.renderIntoDocument(<TimeRange onRangeChange={spy}/>);
      result.refs.end.props.onTimeSelect({
        hour: 3,
        minute: 50
      });
      expect(spy).toHaveBeenCalledWith({
        startHour: 0,
        startMinute: 0,
        endHour: 3,
        endMinute: 50
      });
    });
  });
});

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import TimeSelect from '../index';
import expect from 'expect';

describe('The time select component', () => {
  describe('When rendered', () => {
    it('should render a tag select', () => {
      const result = TestUtils.renderIntoDocument(<TimeSelect />);
      expect(result.refs.tagSelect).toNotBe(undefined);
    });

    it('should be capable of taking in number for the hour and minute', () => {
      const result = TestUtils.renderIntoDocument(<TimeSelect time={{ hour: 1, minute: 30 }}/>);
      expect(result.refs.tagSelect.props.tags).toEqual('01:30');
    });

    it('should be capable of taking in string for the hour and minute', () => {
      const result = TestUtils.renderIntoDocument(<TimeSelect time={{ hour: '1', minute: '30' }}/>);
      expect(result.refs.tagSelect.props.tags).toEqual('01:30');
    });

    it('should be capable of taking in a function that return the hour and minute', () => {
      const result = TestUtils.renderIntoDocument(<TimeSelect time={{ hour: () => 1, minute: () => 30 }}/>);
      expect(result.refs.tagSelect.props.tags).toEqual('01:30');
    });
  });
});

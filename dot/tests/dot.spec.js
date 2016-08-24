import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Dot from '../index';
import expect from 'expect';

describe('The dot component', () => {
  describe('When initialised', () => {
    it('should be invisible by default', () => {
      const result = TestUtils.renderIntoDocument(<Dot id="id_dot_1" />);
      expect(result.props.visible).toBe(false);
    });

    it('should be fail validation by default', () => {
      const result = TestUtils.renderIntoDocument(<Dot id="id_dot_1"/>);
      expect(result.props.mode).toBe('fail');
    });
  });

  describe('When the prop mode is "warning"', () => {
    it('should render the warning colour', () => {
      const result = TestUtils.renderIntoDocument(<Dot
        id="id_dot_1"
        mode="warning"
      />);
      expect(result.refs.root.className.indexOf('Dot--warning')).toBeGreaterThan(-1);
    });
  });

  describe('When the prop mode is "fail"', () => {
    it('should render the fail colour', () => {
      const result = TestUtils.renderIntoDocument(<Dot
        id="id_dot_1"
        mode="fail"
      />);
      expect(result.refs.root.className.indexOf('Dot--fail')).toBeGreaterThan(-1);
    });
  });

  describe('When the prop mode is "ok"', () => {
    it('should render the ok colour', () => {
      const result = TestUtils.renderIntoDocument(<Dot
        id="id_dot_1"
        mode="ok"
      />);
      expect(result.refs.root.className.indexOf('Dot--ok')).toBeGreaterThan(-1);
    });
  });

  describe('When the prop visible is true', () => {
    it('should add the visible class to the root', () => {
      const result = TestUtils.renderIntoDocument(<Dot
        id="id_dot_1"
        visible
      />);
      expect(result.refs.root.className.indexOf('Dot--show')).toBeGreaterThan(-1);
    });
  });

  describe('When the dot is clicked', () => {
    it('should call the dotClick prop function with the prop id as a parameter', () => {
      const spy = expect.createSpy();
      const result = TestUtils.renderIntoDocument(<Dot
        visible
        dotClick={spy}
        id="id_dot_1"
      />);
      TestUtils.Simulate.click(result.refs.root);
      expect(spy).toHaveBeenCalledWith('id_dot_1');
    });
  });
});

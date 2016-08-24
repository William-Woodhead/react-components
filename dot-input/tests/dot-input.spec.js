import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import DotInput from '../index';
import Dot from '../../dot';
import expect from 'expect';
import keycode from 'keycode';

describe('The dot input component', () => {
  describe('When initialised', () => {
    it('should set the phrase to the props phrase', () => {
      const result = TestUtils.renderIntoDocument(<DotInput
        phrase="Washington"
      />);
      expect(result.state.phrase).toBe('Washington');
    });

    it('should render a span with the DotInput class', () => {
      const result = TestUtils.renderIntoDocument(<DotInput
        phrase="Washington"
      />);
      expect(result.refs.root.className.indexOf('DotInput')).toBeGreaterThan(-1);
    });

    it('should set the phrase to an empty string if the props phrase doesnt exist', () => {
      const result = TestUtils.renderIntoDocument(<DotInput />);
      expect(result.state.phrase).toBe('');
    });

    it('should set the valid state to idle', () => {
      const result = TestUtils.renderIntoDocument(<DotInput />);
      expect(['idle'].indexOf(result.state.valid)).toBeGreaterThan(-1);
    });

    it('should contain one dot component', () => {
      const result = TestUtils.renderIntoDocument(<DotInput />);
      let dots = TestUtils.scryRenderedComponentsWithType(result, Dot);
      expect(dots.length).toBe(1);
    });

    it('should set the firstBlur state to false', () => {
      const result = TestUtils.renderIntoDocument(<DotInput />);
      expect(result.state.firstBlur).toBe(false);
    });

    it('should add the block class if the block props is true', () => {
      const result = TestUtils.renderIntoDocument(<DotInput block/>);
      expect(result.refs.root.className.indexOf('DotInput-block')).toBeGreaterThan(-1);
    });
  });

  describe('When the phrase changes', () => {
    it('should reset the phrase state', () => {
      const result = TestUtils.renderIntoDocument(<DotInput />);
      expect(result.state.phrase).toEqual('');
      result.refs.input.props.onChange({ currentTarget: { value: 'massive' } });
      expect(result.state.phrase).toEqual('massive');
    });

    it('should reset the valid state based on the validator', () => {
      const result = TestUtils.renderIntoDocument(<DotInput />);
      expect(['idle'].indexOf(result.state.valid)).toBeGreaterThan(-1);
      result.refs.input.props.onChange({ currentTarget: { value: 'massive' } });
      expect(result.state.valid).toBe('ok');
    });
  });

  describe('When the input is blurred', () => {
    it('should set the firstBlur state to true', () => {
      const result = TestUtils.renderIntoDocument(<DotInput />);
      TestUtils.Simulate.click(result.refs.input.props);
      expect(result.state.firstBlur).toBe(false);
      result.refs.input.props.onBlur();
      expect(result.state.firstBlur).toBe(true);
    });

    it('should set visible to true on the dot', () => {
      const result = TestUtils.renderIntoDocument(<DotInput />);
      TestUtils.Simulate.click(result.refs.input.props);
      expect(result.refs.dot.props.visible).toBe(false);
      result.refs.input.props.onBlur();
      expect(result.refs.dot.props.visible).toBe(true);
    });

    it('should validate the phrase against props validation', () => {
      const spy = expect.createSpy();
      const result = TestUtils.renderIntoDocument(<DotInput
        phrase="this is going to be validated"
        validator={spy}
      />);
      TestUtils.Simulate.click(result.refs.input.props);
      result.refs.input.props.onBlur();
      expect(spy).toHaveBeenCalledWith('this is going to be validated');
    });

    it('should call the submitPhrase props function if the phrase is valid', () => {
      const spy = expect.createSpy();
      const result = TestUtils.renderIntoDocument(<DotInput
        phrase="this is going to be validated"
        validator={() => true}
        submitPhrase={spy}
      />);
      TestUtils.Simulate.click(result.refs.input.props);
      result.refs.input.props.onBlur();
      expect(spy).toHaveBeenCalledWith('this is going to be validated');
    });

    it('should call the submitPhrase props function if there is no validation function', () => {
      const spy = expect.createSpy();
      const result = TestUtils.renderIntoDocument(<DotInput
        phrase="this is going to be validated"
        submitPhrase={spy}
      />);
      TestUtils.Simulate.click(result.refs.input.props);
      result.refs.input.props.onBlur();
      expect(spy).toHaveBeenCalledWith('this is going to be validated');
    });

    it('should set the valid state base on the validator', () => {
      const result = TestUtils.renderIntoDocument(<DotInput
        phrase="this is going to be validated"
        validator={() => true}
      />);
      expect(['idle'].indexOf(result.state.valid)).toBeGreaterThan(-1);
      TestUtils.Simulate.click(result.refs.input.props);
      result.refs.input.props.onBlur();
      expect(result.state.valid).toBe('ok');
    });
  });

  describe('When the dot is clicked', () => {
    it('should call the dot clicked function', () => {
      const spy = expect.createSpy();
      const result = TestUtils.renderIntoDocument(<DotInput dotClick={spy}/>);
      result.refs.dot.props.dotClick();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('When the input is in focus', () => {
    describe('and the esc button is pressed', () => {
      it('should blur the input', () => {
        const result = TestUtils.renderIntoDocument(<DotInput
          phrase="this is going to be validated"
          submitPhrase={spy}
        />);

        const spy = expect.spyOn(result.refs.input, 'blur');
        TestUtils.Simulate.click(result.refs.input.props);
        expect(spy).toNotHaveBeenCalled();
        result.refs.input.props.onKeyUp({ keyCode: keycode.codes.esc });
        expect(spy).toHaveBeenCalled();
      });
    });
  });
});

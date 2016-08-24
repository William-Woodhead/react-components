import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import TagString from '../index';
import Tag from '../../tag';
import expect from 'expect';
import keycode from 'keycode';

describe('The tag string component', () => {
  describe('When initialised', () => {
    it('should have an input', () => {
      const result = TestUtils.renderIntoDocument(<TagString />);
      expect(result.refs.input).toNotBe(undefined);
    });

    it('should have rendered tags for all members of the tags array', () => {
      const result = TestUtils.renderIntoDocument(
        <TagString
          tags={[
            'french',
            'england',
            'food'
          ]}
        />);
      const tags = TestUtils.scryRenderedComponentsWithType(result, Tag);
      expect(tags.length).toBe(3);
    });
  });

  describe('When the enter key is pressed', () => {
    it('should tag up the value in the input', () => {
      const result = TestUtils.renderIntoDocument(
        <TagString
          tags={[
            'french',
            'england',
            'food'
          ]}
        />);
      result.refs.input.focus();
      result.refs.input.value = 'beer';
      result.refs.input.props.onKeyUp({ keyCode: keycode.codes.enter, stopPropagation: par => par, preventDefault: par => par });
      expect(result.state.tags).toEqual([
        'french',
        'england',
        'food',
        'beer'
      ]);
    });

    it('should set the input to an empty string', () => {
      const result = TestUtils.renderIntoDocument(
        <TagString
          tags={[
            'french',
            'england',
            'food'
          ]}
        />);
      result.refs.input.focus();
      result.refs.input.value = 'beer';
      result.refs.input.props.onKeyUp({ keyCode: keycode.codes.enter, stopPropagation: par => par, preventDefault: par => par });
      expect(result.refs.input.value).toBe('');
    });

    it('should NOT tag it up if it is an empty string', () => {
      const result = TestUtils.renderIntoDocument(
        <TagString
          tags={[
            'french',
            'england',
            'food'
          ]}
        />);
      result.refs.input.focus();
      result.refs.input.value = '';
      result.refs.input.props.onKeyUp({ keyCode: keycode.codes.enter, stopPropagation: par => par, preventDefault: par => par });
      expect(result.state.tags).toEqual([
        'french',
        'england',
        'food'
      ]);
    });

    it('should NOT tag it up if it is a duplicate', () => {
      const result = TestUtils.renderIntoDocument(
        <TagString
          tags={[
            'french',
            'england',
            'food'
          ]}
        />);
      result.refs.input.focus();
      result.refs.input.value = 'food';
      result.refs.input.props.onKeyUp({ keyCode: keycode.codes.enter, stopPropagation: par => par, preventDefault: par => par });
      expect(result.state.tags).toEqual([
        'french',
        'england',
        'food'
      ]);
    });
  });

  describe('When the backspace is pressed', () => {
    it('should remove the most recent tag', () => {
      const result = TestUtils.renderIntoDocument(
        <TagString
          tags={[
            'french',
            'england',
            'food'
          ]}
        />);
      result.refs.input.focus();
      result.refs.input.props.onKeyUp({ keyCode: keycode.codes.backspace, stopPropagation: par => par, preventDefault: par => par });
      expect(result.state.tags).toEqual([
        'french',
        'england'
      ]);
    });
  });

  describe('When the input is blurred', () => {
    it('should submit the array of tags', () => {
      const spy = expect.createSpy();
      const result = TestUtils.renderIntoDocument(
        <TagString
          tags={[
            'french',
            'england',
            'food'
          ]}
          onTagsChange={spy}
        />);
      result.refs.input.focus();
      result.refs.input.props.onBlur();
      expect(spy).toHaveBeenCalledWith([
        'french',
        'england',
        'food'
      ]);
    });
  });

  describe('When a tags cross is clicked', () => {
    it('should remove that tag from the tags', () => {
      const result = TestUtils.renderIntoDocument(
        <TagString
          tags={[
            'french',
            'england',
            'food'
          ]}
        />);
      const tags = TestUtils.scryRenderedComponentsWithType(result, Tag);
      tags[0].props.onCrossClick('french');
      expect(result.state.tags).toEqual([
        'england',
        'food'
      ]);
    });
  });
});

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import SelectOption from '../index';
import expect from 'expect';

const option = {
  label: 'This be the label',
  id: '1'
};
const emptyFunc = () => {};

describe('The tag select option component', () => {
  it('should render a div with a child span', () => {
    const result = TestUtils.renderIntoDocument(<SelectOption
      option={option}
      onOptionClick={emptyFunc}
    />);
    const divs = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div');
    const spans = TestUtils.scryRenderedDOMComponentsWithTag(result, 'span');
    expect(spans.length).toBe(1);
    expect(divs.length).toBe(1);
  });

  it('should add the classname "SelectOption" to the root div', () => {
    const result = TestUtils.renderIntoDocument(<SelectOption
      option={option}
      onOptionClick={emptyFunc}
    />);
    expect(result.refs.root.className).toBe('SelectOption');
  });

  it('should add the classname "SelectOption--active" if the highlight prop is true', () => {
    const result = TestUtils.renderIntoDocument(<SelectOption
      option={option}
      onOptionClick={emptyFunc}
      highlight
    />);
    expect(result.refs.root.className).toBe('SelectOption SelectOption--active');
  });

  it('should add the classname "SelectOption-label" to the child span', () => {
    const result = TestUtils.renderIntoDocument(<SelectOption
      option={option}
      onOptionClick={emptyFunc}
    />);
    expect(result.refs.label.className).toBe('SelectOption-label');
  });

  describe('When the option is clicked', () => {
    it('should call the click handler passed into the props with the option\'s value', () => {
      const spy = expect.createSpy();
      const result = TestUtils.renderIntoDocument(<SelectOption
        option={option}
        onOptionClick={spy}
      />);
      TestUtils.Simulate.mouseDown(result.refs.label);
      expect(spy).toHaveBeenCalledWith('1');
    });
  });
});

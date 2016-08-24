import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Tag from '../index';
import expect from 'expect';

const tag = {
  label: 'This be the name',
  id: '1'
};
const emptyFunc = () => {};

describe('The Tag component', () => {
  it('should render a span with two children', () => {
    const result = TestUtils.renderIntoDocument(<Tag tag={tag} onCrossClick={emptyFunc}/>);
    const spans = TestUtils.scryRenderedDOMComponentsWithTag(result, 'span');
    expect(spans.length).toBe(3);
  });

  it('should render the root span with the classname "Tag"', () => {
    const result = TestUtils.renderIntoDocument(<Tag tag={tag} onCrossClick={emptyFunc}/>);
    expect(result.refs.root.className).toBe('Tag');
  });

  it('should render the label span with the classname "Tag-label"', () => {
    const result = TestUtils.renderIntoDocument(<Tag tag={tag} onCrossClick={emptyFunc}/>);
    expect(result.refs.label.className).toBe('Tag-label');
  });

  it('should render the cross span with the classname "Tag-cross"', () => {
    const result = TestUtils.renderIntoDocument(<Tag tag={tag} onCrossClick={emptyFunc}/>);
    expect(result.refs.cross.className).toBe('Tag-cross');
  });

  describe('When the cross is clicked', () => {
    it('should call the onCrossClicked props function with the value of the object passed in', () => {
      const spy = expect.createSpy();
      const result = TestUtils.renderIntoDocument(<Tag tag={tag} onCrossClick={spy}/>);
      const cross = result.refs.cross;
      TestUtils.Simulate.click(cross);
      expect(spy).toHaveBeenCalledWith('1');
    });
  });
});

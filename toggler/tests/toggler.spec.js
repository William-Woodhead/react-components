import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Toggler from '../index';
import expect from 'expect';
import map from 'lodash/map';

const options = [{
  label: 'WEEK',
  id: 'week'
}, {
  label: 'DAY',
  id: 'day'
}, {
  label: 'MONTH',
  id: 'month'
}];

describe('The toggler', () => {
  describe('When initialised', () => {
    it('should render the different enumerated options', () => {
      const result = TestUtils.renderIntoDocument(<Toggler options={options}/>);
      const opts = TestUtils.scryRenderedDOMComponentsWithClass(result, 'Toggler-option');
      expect(opts.length).toBe(3);
    });

    it('should highlight the option if there is a default compoent', () => {
      const result = TestUtils.renderIntoDocument(<Toggler options={options} preset={0}/>);
      const opts = TestUtils.scryRenderedDOMComponentsWithClass(result, 'Toggler-option');
      const active = TestUtils.findRenderedDOMComponentWithClass(result, 'Toggler-option--active');
      expect(active).toEqual(opts[0]);
    });
  });

  describe('When an options is clicked', () => {
    it('should call the callback props with the selected option', () => {
      const spy = expect.createSpy();
      const result = TestUtils.renderIntoDocument(<Toggler options={options} onClick={spy}/>);
      const opts = TestUtils.scryRenderedDOMComponentsWithClass(result, 'Toggler-option');
      TestUtils.Simulate.click(opts[0]);
      expect(spy).toHaveBeenCalledWith({
        label: 'WEEK',
        id: 'week'
      });
    });

    it('should select that option by colouring it different', () => {
      const result = TestUtils.renderIntoDocument(<Toggler options={options} />);
      const opts = TestUtils.scryRenderedDOMComponentsWithClass(result, 'Toggler-option');
      TestUtils.Simulate.click(opts[0]);
      const active = TestUtils.findRenderedDOMComponentWithClass(result, 'Toggler-option--active');
      expect(active).toEqual(opts[0]);
    });

    it('should unselect any selected option', () => {
      const result = TestUtils.renderIntoDocument(<Toggler options={options} />);
      const opts = TestUtils.scryRenderedDOMComponentsWithClass(result, 'Toggler-option');
      TestUtils.Simulate.click(opts[0]);
      let active = TestUtils.findRenderedDOMComponentWithClass(result, 'Toggler-option--active');
      expect(active).toEqual(opts[0]);
      TestUtils.Simulate.click(opts[1]);
      active = TestUtils.findRenderedDOMComponentWithClass(result, 'Toggler-option--active');
      expect(active).toEqual(opts[1]);
    });

    describe('And it is already selected', () => {
      it('should unselect it', () => {
        const result = TestUtils.renderIntoDocument(<Toggler options={options} />);
        const opts = TestUtils.scryRenderedDOMComponentsWithClass(result, 'Toggler-option');
        TestUtils.Simulate.click(opts[0]);
        TestUtils.Simulate.click(opts[0]);
        const actives = TestUtils.scryRenderedDOMComponentsWithClass(result, 'Toggler-option--active');
        expect(actives.length).toBe(0);
      });

      it('should not call the callback', () => {
        const spy = expect.createSpy();
        const result = TestUtils.renderIntoDocument(<Toggler options={options} onClick={spy}/>);
        const opts = TestUtils.scryRenderedDOMComponentsWithClass(result, 'Toggler-option');
        TestUtils.Simulate.click(opts[0]);
        TestUtils.Simulate.click(opts[0]);
        expect(spy.calls.length).toBe(1);
      });
    });
  });

  describe('When the toggler is in required mode', () => {
    it('should not allow deselection of an option', () => {
      const spy = expect.createSpy();
      const result = TestUtils.renderIntoDocument(<Toggler options={options} onClick={spy} preset={0} required/>);
      const opts = TestUtils.scryRenderedDOMComponentsWithClass(result, 'Toggler-option');
      TestUtils.Simulate.click(opts[0]);
      let actives = TestUtils.scryRenderedDOMComponentsWithClass(result, 'Toggler-option--active');
      expect(actives.length).toBe(1);
      actives = TestUtils.scryRenderedDOMComponentsWithClass(result, 'Toggler-option--active');
      expect(actives.length).toBe(1);
    });
  });

  describe('When the toggler is in subtitle mode', () => {
    it('should render subtitles', () => {
      const result = TestUtils.renderIntoDocument(<Toggler options={map(options, (opt) => {
        opt.subtitle = 'sub'; return opt;
      })}
      preset={0}
      subtitle
      required
      />);
      const subtitles = TestUtils.scryRenderedDOMComponentsWithClass(result, 'Toggler-option-subtitle');
      expect(subtitles.length).toBe(3);
    });
  });
});

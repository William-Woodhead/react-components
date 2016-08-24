import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Dropdown from '../index';
import TagSelectOption from '../../select-option';
import expect from 'expect';

describe('The Dropdown component', () => {
  let options;

  beforeEach(() => {
    options = getOptions();
  });

  describe('When initialised', () => {
    it('should set the active state', () => {
      const result = TestUtils.renderIntoDocument(<Dropdown options={options}/>);
      expect(result.state.active).toBe('fr');
    });

    it('should set the options visible state', () => {
      const result = TestUtils.renderIntoDocument(<Dropdown options={options}/>);
      expect(result.state.optionsVisible).toBe(false);
    });

    it('should set the options from the props', () => {
      const result = TestUtils.renderIntoDocument(<Dropdown options={options}/>);
      expect(result.state.options).toEqual(options);
    });

    it('should render the selected option', () => {
      const result = TestUtils.renderIntoDocument(<Dropdown options={options}/>);
      expect(result.refs['title-text'].innerHTML).toBe('French');
    });

    it('should render the props className in the root div', () => {
      const result = TestUtils.renderIntoDocument(<Dropdown className="dasdfd" options={options}/>);
      expect(result.refs.root.className.indexOf('dasdfd')).toBeGreaterThan(-1);
    });

    describe('When there is no selected option', () => {
      it('should render the default option', () => {
        const result = TestUtils.renderIntoDocument(<Dropdown options={getOptions(true)}/>);
        expect(result.refs['title-text'].innerHTML).toBe('English');
      });

      describe('and there is no default option', () => {
        it('should render the first option', () => {
          const result = TestUtils.renderIntoDocument(<Dropdown options={options}/>);
          expect(result.refs['title-text'].innerHTML).toBe('French');
        });
      });

      describe('And there are no options', () => {
        it('should render the "No options..."', () => {
          const result = TestUtils.renderIntoDocument(<Dropdown options={[]}/>);
          expect(result.refs['title-text'].innerHTML).toBe('No options...');
        });
      });
    });

    it('should render the options with the select option', () => {
      const result = TestUtils.renderIntoDocument(<Dropdown options={options}/>);
      const optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
      expect(optionz.length).toBe(6);
    });

    it('should render the options without the select option if it is required', () => {
      const result = TestUtils.renderIntoDocument(<Dropdown options={options} required/>);
      const optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
      expect(optionz.length).toBe(5);
    });
  });

  describe('When an option is clicked', () => {
    it('should set the active state', () => {
      const result = TestUtils.renderIntoDocument(<Dropdown options={options}/>);
      const optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
      optionz[3].props.onOptionClick('es');
      expect(result.state.active).toBe('es');
    });

    it('should set the active state to -1 if the select option is clicked', () => {
      const result = TestUtils.renderIntoDocument(<Dropdown options={options}/>);
      const optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
      optionz[0].props.onOptionClick('__SELECT__');
      expect(result.state.active).toBe(-1);
    });

    it('should call the prop onOptionClick with the option', () => {
      const spy = expect.createSpy();
      const result = TestUtils.renderIntoDocument(<Dropdown onOptionClick={spy} options={options}/>);
      const optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
      optionz[3].props.onOptionClick('es');
      expect(spy).toHaveBeenCalledWith('es');
    });
  });

  describe('When the toggle is clicked', () => {
    it('should toggle the optionsVisible state', () => {
      const result = TestUtils.renderIntoDocument(<Dropdown options={options}/>);
      expect(result.state.optionsVisible).toBe(false);
      TestUtils.Simulate.click(result.refs.toggle);
      expect(result.state.optionsVisible).toBe(true);
      TestUtils.Simulate.click(result.refs.toggle);
      expect(result.state.optionsVisible).toBe(false);
    });
  });

  describe('When the selectedEditable props is true', () => {
    it('should allow the selected label to be changed', () => {
      const result = TestUtils.renderIntoDocument(<Dropdown options={options} selectedEditable/>);
      expect(result.refs.input).toNotBe(undefined);
    });

    describe('When the input is focused', () => {
      it('should fill the input with the placeholder text', () => {
        const result = TestUtils.renderIntoDocument(<Dropdown options={options} selectedEditable/>);
        expect(result.refs.input.value).toNotBe('French');
        result.refs.input.props.onFocus();
        expect(result.refs.input.value).toBe('French');
      });
    });

    describe('When the input is changed', () => {
      it('should set the emptyInput state to true if the string is empty', () => {
        const result = TestUtils.renderIntoDocument(<Dropdown options={options} selectedEditable/>);
        result.refs.input.value = '';
        result.refs.input.props.onChange();
        expect(result.state.emptyInput).toBe(true);
      });

      it('should set the emptyInput state to false if the string is empty', () => {
        const result = TestUtils.renderIntoDocument(<Dropdown options={options} selectedEditable/>);
        result.refs.input.value = 'af';
        result.refs.input.props.onChange();
        expect(result.state.emptyInput).toBe(false);
      });
    });

    describe('When the input is blurred', () => {
      it('should call the onSelectedEdit prop with the new label', () => {
        const spy = expect.createSpy();
        const result = TestUtils.renderIntoDocument(<Dropdown options={options} selectedEditable onSelectedEdit={spy}/>);
        expect(result.refs.input.value).toNotBe('Summer');
        result.refs.input.value = 'Summer';
        result.refs.input.props.onBlur();
        expect(spy).toHaveBeenCalledWith({ label: 'Summer', id: 'fr' });
      });

      it('should reset the value to an empty string', () => {
        const spy = expect.createSpy();
        const result = TestUtils.renderIntoDocument(<Dropdown options={options} selectedEditable onSelectedEdit={spy}/>);
        result.refs.input.value = 'Summer';
        result.refs.input.props.onBlur();
        expect(result.refs.input.value).toBe('');
      });

      it('should set the emptyInput state to false', () => {
        const result = TestUtils.renderIntoDocument(<Dropdown options={options} selectedEditable/>);
        result.refs.input.value = '';
        result.refs.input.props.onChange();
        expect(result.state.emptyInput).toBe(true);
        result.refs.input.props.onBlur();
        expect(result.state.emptyInput).toBe(false);
      });

      it('should NOT call the onSelectedEdit prop if it is an empty string', () => {
        const spy = expect.createSpy();
        const result = TestUtils.renderIntoDocument(<Dropdown options={options} selectedEditable onSelectedEdit={spy}/>);
        result.refs.input.value = '';
        result.refs.input.props.onBlur();
        expect(spy).toNotHaveBeenCalled();
      });

      it('should NOT call the onSelectedEdit prop if it the same title', () => {
        const spy = expect.createSpy();
        const result = TestUtils.renderIntoDocument(<Dropdown options={options} preset={'fr'} selectedEditable onSelectedEdit={spy}/>);
        result.refs.input.value = 'French';
        result.refs.input.props.onBlur();
        expect(spy).toNotHaveBeenCalled();
      });
    });
  });
});

function getOptions(noneSelected, noDefault) {
  return [{
    label: 'French',
    id: 'fr',
    selected: !noneSelected
  }, {
    label: 'English',
    id: 'en',
    default: !noDefault,
    selected: false
  }, {
    label: 'Italian',
    id: 'it',
    selected: false
  }, {
    label: 'Spanish',
    id: 'es',
    selected: false
  }, {
    label: 'Irish',
    id: 'ri',
    selected: false
  }];
}

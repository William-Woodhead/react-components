import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import keycode from 'keycode';
import TagSelect from '../index';
import TagSelectOption from '../../select-option';
import Tag from '../../tag';
import expect from 'expect';

describe('The tag select component', () => {
  let options;

  beforeEach(() => {
    options = getOptions();
  });

  describe('When initialised', () => {
    it('should set the initial state optionIndex to 0 and optionsVisible to false', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options}
      />);
      expect(result.state.optionIndex).toEqual(0);
      expect(result.state.optionsVisible).toEqual(false);
    });

    it('should set the initial state tags to empty array by default', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options}
      />);
      expect(result.state.tags).toEqual([]);
    });

    it('should set the initial state tags to props tag if it exists in the options', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options} tags={['france']}
      />);
      expect(result.state.tags).toEqual(['france']);
    });

    it('should NOT set the initial state tags to props tag if it DOES NOT sexists in the options', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options} tags={['wassup']}
      />);
      expect(result.state.tags).toEqual([]);
    });

    it('should set the initial state phrase to empty string by default', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options}
      />);
      expect(result.state.phrase).toEqual('');
    });

    it('should set the initial state phrase to props phrase', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options} phrase={'wassup'}
      />);
      expect(result.state.phrase).toEqual('wassup');
    });

    it('should set the initial state options to props options with selected keys based on props tag', () => {
      options = getOptions(2);
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options} tags={['england']}
      />);
      expect(result.state.options).toEqual([{
        id: 'france',
        label: 'France',
        selected: false
      }, {
        id: 'england',
        label: 'England',
        selected: true
      }]);
    });

    it('should render a root div with the tag select classname', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options}
      />);
      expect(result.refs.root.className).toBe('TagSelect');
    });

    it('should render a root div with the tag select single tag classname in single tag mode', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options}
        singleTagMode
      />);
      expect(result.refs.root.className).toBe('TagSelect TagSelect--singleTagMode');
    });

    it('should render the tags', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options} tags={['england', 'france']}
      />);
      const tags = TestUtils.scryRenderedComponentsWithType(result, Tag);
      expect(tags.length).toBe(2);
    });

    it('should NOT render the tags in single tag mode', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options} tags={['england']}
        singleTagMode
      />);
      const tags = result.refs.tags;
      expect(tags).toBe(undefined);
    });

    it('should NOT render the single tag by default', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options} tags={['england']}
      />);
      const tag = result.refs.singleTag;
      expect(tag).toBe(undefined);
    });

    it('should render the single tag in single tag mode', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options} tags={['england']}
        singleTagMode
      />);
      const tag = result.refs.singleTag;
      expect(tag).toNotBe(undefined);
    });

    it('should render the options', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options}
      />);
      const optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
      expect(optionz.length).toBe(7);
    });
  });

  describe('When a tag is clicked', () => {
    it('should remove the tag from the tags array', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options} tags={['england', 'france']}
      />);
      const tags = TestUtils.scryRenderedComponentsWithType(result, Tag);
      expect(result.state.tags).toEqual(['england', 'france']);
      tags[0].props.onCrossClick('england');
      expect(result.state.tags).toEqual(['france']);
    });

    it('should switch the options to being unselected', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options} tags={['england', 'france']}
      />);
      const tags = TestUtils.scryRenderedComponentsWithType(result, Tag);
      expect(result.state.options[1].selected).toEqual(true);
      tags[0].props.onCrossClick('england');
      expect(result.state.options[1].selected).toEqual(false);
    });
  });

  describe('When the input is focused', () => {
    it('should show the options', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options}
      />);
      expect(result.state.optionsVisible).toBe(false);
      result.refs.input.props.onFocus();
      expect(result.state.optionsVisible).toBe(true);
    });
  });

  describe('When the input is blurred', () => {
    it('should hide the options', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options}
      />);
      expect(result.state.optionsVisible).toBe(false);
      result.refs.input.props.onFocus();
      expect(result.state.optionsVisible).toBe(true);
      result.refs.input.props.onBlur();
      expect(result.state.optionsVisible).toBe(false);
    });
  });

  describe('When the value of input changes', () => {
    it('should update the phrase', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options}
      />);
      expect(result.state.phrase).toBe('');
      result.refs.input.props.onChange({ currentTarget: { value: 'massive' } });
      expect(result.state.phrase).toBe('massive');
    });

    it('should only show options that match the phrase', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options}
      />);
      expect(result.state.phrase).toBe('');
      let optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
      expect(optionz.length).toBe(7);
      result.refs.input.props.onChange({ currentTarget: { value: 'fra' } });
      optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
      expect(optionz.length).toBe(1);
    });
  });

  describe('When an option is clicked', () => {
    it('should add the option to the tags', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options}
      />);
      const optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
      optionz[0].props.onOptionClick('france');
      expect(result.state.tags).toEqual(['france']);
    });

    it('should switch the option to being selected', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options}
      />);
      const optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
      expect(result.state.options[0].selected).toBe(false);
      optionz[0].props.onOptionClick('france');
      expect(result.state.options[0].selected).toBe(true);
    });

    it('should keep focus in the input', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options}
      />);
      const spy = expect.spyOn(result.refs.input, 'focus');
      const optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
      expect(spy).toNotHaveBeenCalled();
      optionz[0].props.onOptionClick('france');
      expect(spy).toHaveBeenCalled();
    });

    it('should submit the tags array with the onSubmit prop', () => {
      const spy = expect.createSpy();
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options}
        onSubmit={spy}
      />);

      let optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
      optionz[0].props.onOptionClick('france');
      expect(spy).toHaveBeenCalledWith([{
        label: 'France',
        id: 'france',
        selected: true
      }]);

      optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
      optionz[0].props.onOptionClick('england');
      expect(spy).toHaveBeenCalledWith([{
        label: 'France',
        id: 'france',
        selected: true
      }, {
        label: 'England',
        id: 'england',
        selected: true
      }]);
    });

    describe('And we are in single tag mode', () => {
      it('should replace the selected tag', () => {
        const result = TestUtils.renderIntoDocument(<TagSelect
          options={options}
          singleTagMode
        />);
        let optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
        optionz[0].props.onOptionClick('france');
        expect(result.state.tags).toEqual(['france']);
        optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
        optionz[0].props.onOptionClick('england');
        expect(result.state.tags).toEqual(['england']);
      });

      it('should blur the input', () => {
        const result = TestUtils.renderIntoDocument(<TagSelect
          options={options}
          singleTagMode
        />);
        const focusSpy = expect.spyOn(result.refs.input, 'focus');
        const blurSpy = expect.spyOn(result.refs.input, 'blur');
        const optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
        expect(focusSpy).toNotHaveBeenCalled();
        expect(blurSpy).toNotHaveBeenCalled();
        optionz[0].props.onOptionClick('france');
        expect(focusSpy).toNotHaveBeenCalled();
        expect(blurSpy).toHaveBeenCalled();
      });

      it('should submit the tag NOT in an array with the onSubmit prop', () => {
        const spy = expect.createSpy();
        const result = TestUtils.renderIntoDocument(<TagSelect
          options={options}
          onSubmit={spy}
          singleTagMode
        />);

        let optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
        optionz[0].props.onOptionClick('france');
        expect(spy).toHaveBeenCalledWith({
          label: 'France',
          id: 'france',
          selected: true
        });

        optionz = TestUtils.scryRenderedComponentsWithType(result, TagSelectOption);
        optionz[0].props.onOptionClick('england');
        expect(spy).toHaveBeenCalledWith({
          label: 'England',
          id: 'england',
          selected: true
        });
      });
    });
  });

  describe('When the input is focused and the key up event occurs', () => {
    describe('When it is the esc key', () => {
      it('should hide the options', () => {
        const result = TestUtils.renderIntoDocument(<TagSelect
          options={options}
        />);
        result.refs.input.props.onFocus();
        expect(result.state.optionsVisible).toBe(true);
        result.refs.input.props.onKeyUp({ keyCode: keycode.codes.esc });
        expect(result.state.optionsVisible).toBe(false);
      });

      it('should blur the input', () => {
        const result = TestUtils.renderIntoDocument(<TagSelect
          options={options}
        />);
        const spy = expect.spyOn(result.refs.input, 'blur');
        result.refs.input.props.onFocus();
        expect(spy).toNotHaveBeenCalled();
        result.refs.input.props.onKeyUp({ keyCode: keycode.codes.esc });
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('When it is the enter key', () => {
      it('should simulate a click on the selected option', () => {
        const result = TestUtils.renderIntoDocument(<TagSelect
          options={options}
        />);
        result.refs.input.props.onFocus();
        let tags = TestUtils.scryRenderedComponentsWithType(result, Tag);
        expect(tags.length).toBe(0);
        result.refs.input.props.onKeyUp({ keyCode: keycode.codes.enter });
        tags = TestUtils.scryRenderedComponentsWithType(result, Tag);
        expect(tags.length).toBe(1);
      });
    });

    describe('When it is the down key', () => {
      it('should highlight the next unselected option', () => {
        const result = TestUtils.renderIntoDocument(<TagSelect
          options={options}
        />);
        result.refs.input.props.onFocus();
        expect(result.state.optionIndex).toBe(0);
        result.refs.input.props.onKeyUp({ keyCode: keycode.codes.down });
        expect(result.state.optionIndex).toBe(1);
      });
    });

    describe('When it is the up key', () => {
      it('should highlight the previous unselected option', () => {
        const result = TestUtils.renderIntoDocument(<TagSelect
          options={options}
        />);
        result.refs.input.props.onFocus();
        expect(result.state.optionIndex).toBe(0);
        result.refs.input.props.onKeyUp({ keyCode: keycode.codes.down });
        expect(result.state.optionIndex).toBe(1);
        result.refs.input.props.onKeyUp({ keyCode: keycode.codes.up });
        expect(result.state.optionIndex).toBe(0);
      });
    });

    describe('When it is the backspace key', () => {
      it('should remove the latest tag', () => {
        const result = TestUtils.renderIntoDocument(<TagSelect
          options={options} tags={['england', 'france']}
        />);
        result.refs.input.props.onFocus();
        expect(result.state.tags).toEqual(['england', 'france']);
        result.refs.input.props.onKeyUp({ keyCode: keycode.codes.backspace });
        expect(result.state.tags).toEqual(['england']);
      });
    });
  });

  describe('The tags props parser', () => {
    it('should take in an array of string ids', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options} tags={['england', 'france']}
      />);
      expect(result.state.tags).toEqual(['england', 'france']);
    });

    it('should take in an array of objects with ids', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options} tags={[{ id: 'england' }, { id: 'france' }]}
      />);
      expect(result.state.tags).toEqual(['england', 'france']);
    });

    it('should take be an empty array if there is no tags', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options}
      />);
      expect(result.state.tags).toEqual([]);
    });

    it('should take be an empty array if there is no tags', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options}
      />);
      expect(result.state.tags).toEqual([]);
    });

    it('should convert an object with an id key to an array', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options} tags={{ id: 'england' }}
        />);
      expect(result.state.tags).toEqual(['england']);
    });

    it('should convert a string to an array', () => {
      const result = TestUtils.renderIntoDocument(<TagSelect
        options={options} tags={'england'}
        />);
      expect(result.state.tags).toEqual(['england']);
    });

    describe('in single tag mode', () => {
      it('should take the first member of the array', () => {
        const result = TestUtils.renderIntoDocument(<TagSelect
          options={options} tags={[{ id: 'england' }, { id: 'france' }]}
          singleTagMode
          />);
        expect(result.state.tags).toEqual(['england']);
      });

      it('should convert a string to an array', () => {
        const result = TestUtils.renderIntoDocument(<TagSelect
          options={options} tags={'england'}
          singleTagMode
          />);
        expect(result.state.tags).toEqual(['england']);
      });

      it('should convert an object with an id key to an array', () => {
        const result = TestUtils.renderIntoDocument(<TagSelect
          options={options} tags={{ id: 'england' }}
          singleTagMode
          />);
        expect(result.state.tags).toEqual(['england']);
      });
    });

    describe('When the options are async', () => {
      it('should call the async function when the input is focused', (done) => {
        const result = TestUtils.renderIntoDocument(<TagSelect
          getAsyncOptions={getAsyncOptions}
          singleTagMode
          asynk
        />);
        result.refs.input.props.onFocus();
        setTimeout(() => {
          expect(result.state.options).toEqual([{
            label: 'France',
            id: 'france',
            selected: false
          }, {
            label: 'England',
            id: 'england',
            selected: false
          }]);
          done();
        }, 100);
      });
    });
  });
});

function getAsyncOptions() {
  return Promise.resolve(getOptions(2));
}

function getOptions(count = 7) {
  return [{
    label: 'France',
    id: 'france'
  }, {
    label: 'England',
    id: 'england'
  }, {
    label: 'Italy',
    id: 'italy'
  }, {
    label: 'Spain',
    id: 'spain'
  }, {
    label: 'Ireland',
    id: 'ireland'
  }, {
    label: 'Sweden',
    id: 'sweden'
  }, {
    label: 'Norway',
    id: 'norway'
  }].slice(0, count);
}

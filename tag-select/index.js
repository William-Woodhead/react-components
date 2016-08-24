import React, { Component, PropTypes } from 'react';
import classname from 'classname';
import keycode from 'keycode';

import map from 'lodash/map';
import assign from 'lodash/assign';
import reduce from 'lodash/reduce';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import find from 'lodash/find';

import Tag from '../tag';
import TagSelectOption from '../select-option';

const ROOT = 'TagSelect';
const TAGS = 'TagSelect-tags';
const INPUT = 'TagSelect-input';
const INPUT_WRAPPER = 'TagSelect-inputWrapper';
const OPTIONS = 'TagSelect-options';
const OPTIONS_VISIBLE = 'TagSelect-options--show';

const SINGLE_TAG_MODE = 'TagSelect--singleTagMode';
const TAGS_SELECTED = 'TagSelect--tagsSelected';
const SINGLE_TAG = 'TagSelect-singleTag';

export default class TagSelect extends Component {
  constructor(props) {
    super(props);

    const tags = checkExistsInOptions(parseTags(props), props.options);

    this.state = {
      phrase: props.phrase,
      tags,
      options: props.asynk ? [] : map(props.options, setSelected(tags)),
      optionIndex: 0,
      optionsVisible: false,
      optionsLoaded: false,
      asynk: props.asynk
    };
  }

  loadAsync() {
    if (this.props.asynk && !this.state.optionsLoaded) {
      this.props.getAsyncOptions().then((options) => {
        const tags = checkExistsInOptions(parseTags(this.props), options);
        this.setState({ tags, options: map(options, setSelected(tags)) }, () => {
          this.onSubmit();
        });
      });
    }
  }

  componentWillReceiveProps(newProps) {
    const tags = checkExistsInOptions(parseTags(newProps), newProps.options);
    this.setState({ tags, options: map(newProps.options, setSelected(tags)), optionsLoaded: newProps.options.length });
    this.loadAsync();
    this.setState({ phrase: '' });
  }

  phraseChange(event = {
      currentTarget: {
        value: ''
      }
    }) {
    this.setState({ phrase: event.currentTarget.value });
  }

  showOptions() {
    this.setState({ optionsVisible: true, optionIndex: 0 });
    this.forceInputFocus();
  }

  hideOptions() {
    this.setState({ optionsVisible: false });
  }

  inputFocus() {
    this.loadAsync();
    this.setState({ optionsVisible: true });
  }

  enterHandler() {
    const unselected = getPhrasedAndUnselected(
      this.state.options, this.state.phrase
    );

    if (unselected.length && unselected[this.state.optionIndex]) {
      this.onOptionClick(unselected[this.state.optionIndex].id);
    }

    this.setState({ phrase: '', optionIndex: 0 });
  }

  forceInputFocus() {
    this.refs.input.focus();
  }

  forceInputBlur() {
    this.refs.input.blur();
  }

  onOptionClick(id) {
    const index = findIndex(this.state.options, ['id', id]);
    if (index > -1) {
      const options = cloneArray(this.state.options);
      options[index].selected = true;

      if (this.props.singleTagMode) {
        forEach(this.state.tags, (tag) => {
          this.tagRemove(tag);
        });
      }

      const tags = this.props.singleTagMode ? [] : cloneArray(this.state.tags);
      tags.push(id);

      this.setState({ options, phrase: '', tags }, () => {
        this.onSubmit();
      });
    }

    if (!this.props.singleTagMode) {
      this.forceInputFocus();
    } else {
      this.forceInputBlur();
    }
  }

  onSubmit() {
    const { options, tags } = this.state;
    const submission = getTags(options, tags);

    if (this.props.singleTagMode) {
      this.props.onSubmit(submission[0] ? submission[0] : null);
      return;
    }

    this.props.onSubmit(submission);
  }

  escHandler() {
    this.hideOptions();
    this.forceInputBlur();
  }

  downHandler() {
    this.setState({ optionIndex: this.state.optionIndex === getPhrasedAndUnselected(this.state.options, this.state.phrase).length - 1 ? 0 : this.state.optionIndex + 1 });
  }

  backspaceHandler() {
    if (this.state.phrase.length === 0 && this.state.tags.length > 0) {
      const id = this.state.tags[this.state.tags.length - 1];
      this.tagRemove(id);
    }
  }

  upHandler() {
    this.setState({ optionIndex: this.state.optionIndex === 0 ? getPhrasedAndUnselected(this.state.options, this.state.phrase).length - 1 : this.state.optionIndex - 1 });
  }

  inputBlur() {
    this.hideOptions();
  }

  keyAction(event = { keyCode: '' }) {
    switch (event.keyCode) {
      case keycode.codes.esc:
        this.escHandler();
        break;
      case keycode.codes.enter:
        this.enterHandler();
        break;
      case keycode.codes.down:
        this.downHandler();
        break;
      case keycode.codes.up:
        this.upHandler();
        break;
      case keycode.codes.backspace:
        this.backspaceHandler();
        break;
      default:
    }
  }

  tagRemove(id) {
    const tags = cloneArray(this.state.tags);
    const tagIndex = tags.indexOf(id);
    tags.splice(tagIndex, 1);

    const options = cloneArray(this.state.options);
    const optionIndex = findIndex(options, ['id', id]);
    if (options[optionIndex])
      options[optionIndex].selected = false;

    this.setState({ tags, options }, () => {
      this.onSubmit();
      this.forceInputFocus();
    });
  }

  renderTags() {
    if (this.props.singleTagMode) {
      return null;
    }

    const tags = map(getTags(this.state.options, this.state.tags), (tag, index) => {
      return (<Tag key={index} tag={tag} onCrossClick={::this.tagRemove} />);
    });

    return (
      <div ref='tags' className={TAGS}>
        {tags}
      </div>
      );
  }

  renderOptions() {
    return map(getPhrasedAndUnselected(this.state.options, this.state.phrase), (option, index) => {
      return (
        <TagSelectOption key={option.id} option={option} onOptionClick={::this.onOptionClick} highlight={index === this.state.optionIndex} />
        );
    });
  }

  renderSingleTag() {
    if (!this.props.singleTagMode) {
      return null;
    }

    const tags = getTags(this.state.options, this.state.tags);

    if (!tags.length) {
      return null;
    }

    return (
      <span ref='singleTag' className={SINGLE_TAG}><Tag tag={tags[0]} onCrossClick={::this.tagRemove} /></span>
      );
  }

  render() {
    const classNames = [
      ROOT,
      {
        [OPTIONS_VISIBLE]: this.state.optionsVisible
      },
      {
        [SINGLE_TAG_MODE]: this.props.singleTagMode
      },
      {
        [TAGS_SELECTED]: this.props.singleTagMode && this.state.tags.length
      }
    ];
    return (
      <div ref='root' className={classname(classNames)}>
        {this.renderTags()}
        <span ref='input-wrapper' className={INPUT_WRAPPER}>{this.renderSingleTag()} <input
                                                                                           ref='input'
                                                                                           placeholder={this.props.singleTagMode && this.state.tags.length ? 'Change...' : this.props.placeholder}
                                                                                           className={INPUT}
                                                                                           onChange={::this.phraseChange}
                                                                                           value={this.state.phrase}
                                                                                           onFocus={::this.inputFocus}
                                                                                           onKeyUp={::this.keyAction}
                                                                                           onBlur={::this.inputBlur} /></span>
        <div ref='options' className={OPTIONS}>
          {::this.renderOptions()}
        </div>
      </div>
      );
  }

}

function getTags(options, tags) {
  const optionsById = reduce(options, (result, option) => {
    result[option.id] = option; // eslint-disable-line no-param-reassign
    return result;
  }, { });

  return map(tags, (tagId) => {
    return assign({ }, optionsById[tagId]);
  });
}

export function getPhrasedAndUnselected(options, phrase) {
  return reduce(options, (result, option) => {
    if (!phrase && !option.selected) {
      result.push(option);
      return result;
    }

    if (!option.selected && option.label.toLowerCase().indexOf(phrase.toLowerCase()) > -1) {
      result.push(option);
    }

    return result;
  }, []);
  return opts;
}

function setSelected(tags) {
  return function mapper(option) {
    const opt = assign({ }, option);
    opt.selected = tags.indexOf(opt.id) > -1; // eslint-disable-line no-param-reassign
    return opt;
  };
}

function cloneArray(array) {
  return array.slice(0);
}

function checkExistsInOptions(tags, options) {
  return reduce(tags, (result, tag) => {
    if (find(options, { id: tag })) {
      result.push(tag);
    }

    return result;
  }, []);
}

function parseTags(props) {
  if (isArray(props.tags)) {
    if (props.tags[0] && isObject(props.tags[0])) {
      return props.singleTagMode ? extractIds(props.tags.slice(0, 1)) : extractIds(cloneArray(props.tags));
    }

    return props.singleTagMode ? props.tags.slice(0, 1) : cloneArray(props.tags);
  }

  if (isObject(props.tags)) {
    return [props.tags.id];
  }

  return props.tags ? [props.tags] : [];
}

function extractIds(arr) {
  return map(arr, item => item.id);
}

TagSelect.defaultProps = {
  tags: [],
  options: [], // array of object that should have three keys: label, id, selected
  phrase: '',
  onSubmit: par => par,
  singleTagMode: false,
  placeholder: 'Select...',
  asynk: false,
  getAsyncOptions: par => par
};

TagSelect.propTypes = {
  tags: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string, PropTypes.number]),
  options: PropTypes.array,
  phrase: PropTypes.string,
  onSubmit: PropTypes.func,
  singleTagMode: PropTypes.bool,
  placeholder: PropTypes.string,
  asynk: PropTypes.bool,
  getAsyncOptions: PropTypes.func
};

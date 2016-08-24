import React, { Component, PropTypes } from 'react';
import classname from 'classname';
import keycode from 'keycode';
import cloneDeep from 'lodash/cloneDeep';
import map from 'lodash/map';
import Tag from '../tag';

const ROOT = 'TagString';
const TAGS = 'TagString-tags';
const INPUT_WRAPPER = 'TagString-inputWrapper';
const INPUT = 'TagString-input';

function genState(props) {
  return {
    tags: props.tags ? props.tags : []
  };
}

export default class TagString extends Component {
  constructor(props) {
    super(props);

    this.state = genState(props);
  }

  componentWillReceiveProps(newProps) {
    this.setState(genState(newProps));
  }

  inputBlur() {
    this.props.onTagsChange(this.state.tags);
  }

  enterHandler(event) {
    event.stopPropagation();
    event.preventDefault();

    const { value } = this.refs.input;
    if (value === '') {
      return;
    }

    if (this.state.tags.indexOf(value) > -1) {
      return;
    }

    this.refs.input.value = '';
    this.setState({
      tags: this.state.tags.concat(value)
    });
  }

  backspaceHandler(event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.refs.input.value === '' && this.state.tags.length > 0) {
      this.setState({
        tags: this.state.tags.slice(0, this.state.tags.length - 1)
      });
    }
  }

  keyAction(event = { keyCode: '' }) {
    switch (event.keyCode) {
      case keycode.codes.enter:
        this.enterHandler(event); break;
      case keycode.codes.backspace:
        this.backspaceHandler(event); break;
      default:
    }
  }

  forceInputFocus() {
    this.refs.input.focus();
  }

  tagRemove(id) {
    const tags = cloneDeep(this.state.tags);
    const tagIndex = tags.indexOf(id);
    tags.splice(tagIndex, 1);

    this.setState({
      tags
    }, () => {
      this.forceInputFocus();
    });
  }

  renderTags() {
    const tags = map(this.state.tags, (tag, index) => {
      return (<Tag key={index} tag={{ id: tag, label: tag }} onCrossClick={::this.tagRemove} />);
    });

    return (
      <span ref="tags" className={TAGS}>
        {tags}
      </span>
    );
  }

  render() {
    return (
      <div
        className={classname([
          ROOT,
          this.props.className
        ])}
        ref="root"
      >
      <span ref="input-wrapper" className={INPUT_WRAPPER}>
        {::this.renderTags()}
        <input
          ref="input"
          className={INPUT}
          onKeyUp={::this.keyAction}
          onBlur={::this.inputBlur}
          placeholder={this.props.placeholder}
        />
      </span>
      </div>
    );
  }
}

TagString.defaultProps = {
  tags: [],
  onTagsChange: par => par,
  placeholder: 'Write text and press enter to tag...'
};

TagString.propTypes = {
  className: PropTypes.string,
  tags: PropTypes.array,
  onTagsChange: PropTypes.func,
  placeholder: PropTypes.string
};

import React, { Component, PropTypes } from 'react';
import classname from 'classname';
import SelectOption from '../select-option';

import map from 'lodash/map';
import findKey from 'lodash/findKey';
import trim from 'lodash/trim';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import keys from 'lodash/keys';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import size from 'lodash/size';

const SELECT_LABEL = 'Select...';
const NO_OPTIONS_LABEL = 'No options...';
const SELECT_ID = '__SELECT__';

const ROOT = 'Dropdown';
const INPUT = 'Dropdown-input';
const HEADER = 'Dropdown-header';
const TOGGLE = 'Dropdown-toggle';
const OPTIONS = 'Dropdown-options';
const OPTIONS_VISIBLE = 'Dropdown-options--show';
const INPUT_EMPTY = 'Dropdown-input--empty';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    const { options, preset } = this.props;
    this.state = {
      options,
      active: getActiveFromOptions(options, preset),
      optionsVisible: false,
      emptyInput: false
    };
  }

  componentWillReceiveProps(newProps) {
    const { options, preset } = newProps;
    this.setState({
      active: getActiveFromOptions(options, preset),
      options
    });
  }

  toggle() {
    this.setState({
      optionsVisible: !this.state.optionsVisible
    });
  }

  onOptionClick(id) {
    this.setState({
      active: id === SELECT_ID ? -1 : id,
      optionsVisible: false
    }, () => {
      this.props.onOptionClick(this.state.active);
    });
  }

  inputBlur() {
    const value = trim(this.refs.input.value);
    const option = find(this.state.options, { id: this.state.active });
    const optionsLabel = option ? option.label : '$STRINGTHATWOULDNEVERBEWRITTEN))£R££';
    if (value.length > 0 && value !== optionsLabel) {
      this.props.onSelectedEdit({
        label: value,
        id: this.state.active
      });
    }

    this.refs.input.value = '';
    this.setState({
      emptyInput: false
    });
  }

  inputFocus() {
    const option = find(this.state.options, { id: this.state.active });
    this.refs.input.value = option ? option.label : '';
  }

  onInputChange() {
    if (this.refs.input.value === '') {
      this.setState({
        emptyInput: true
      });
      return;
    }

    this.setState({
      emptyInput: false
    });
  }

  renderSelected() {
    const { options, active } = this.state;

    if (active === -1 && options.length < 1) {
      return NO_OPTIONS_LABEL;
    }

    if (this.state.active === -1) {
      return SELECT_LABEL;
    }

    if (this.props.selectedEditable) {
      return (
        <input
          ref="input"
          className={classname([
            INPUT,
            { [INPUT_EMPTY]: this.state.emptyInput }
          ])}
          placeholder={getInputValue(options, active)}
          onBlur={::this.inputBlur}
          onFocus={::this.inputFocus}
          onChange={::this.onInputChange}
        />);
    }

    return getInputValue(options, active);
  }

  renderOptions() {
    return map(this.state.options, (option, index) => {
      return (
        <SelectOption
          key={index}
          option={option}
          onOptionClick={::this.onOptionClick}
        />);
    });
  }

  renderSelect() {
    return (
      <SelectOption
        option={{
          id: SELECT_ID,
          label: SELECT_LABEL
        }}
        onOptionClick={::this.onOptionClick}
      />);
  }

  render() {
    const { options } = this.state;
    return (
      <span
        ref="root"
        className={classname([
          this.props.className,
          ROOT,
          { [OPTIONS_VISIBLE]: this.state.optionsVisible }
        ])}
      >
        <span
          ref="title"
          className={HEADER}
          onClick={::this.toggle}
        >
          <span ref="title-text">
            {::this.renderSelected()}
          </span>
          <span
            ref="toggle"
            className={TOGGLE}
          >
          </span>
        </span>
        <div
          ref="options"
          className={classname([
            OPTIONS
          ])}
        >
          {this.props.required || !size(options) ? null : this.renderSelect()}
          {this.renderOptions()}
        </div>
      </span>
    );
  }
}

function getActiveFromOptions(options, preset) {
  if (findIndex(options, { id: preset }) > -1) {
    return preset;
  }

  if (options.length === 0) {
    return -1;
  }

  const selected = findIndex(options, (opt) => (opt.selected));

  if (selected > -1) {
    return options[selected].id;
  }

  const defolt = findIndex(options, (opt) => (opt.default));
  if (defolt > -1) {
    return options[defolt].id;
  }

  return -1;
}

function getInputValue(options, active) {
  const option = find(options, { id: active });
  return option ? option.label : '';
}

Dropdown.defaultProps = {
  onOptionClick: par => par,
  onSelectedEdit: par => par,
  required: false,
  options: {}
};

Dropdown.propTypes = {
  options: PropTypes.any,
  onOptionClick: PropTypes.func,
  preset: PropTypes.any,
  className: PropTypes.string,
  selectedEditable: PropTypes.bool,
  onSelectedEdit: PropTypes.func,
  required: PropTypes.bool
};

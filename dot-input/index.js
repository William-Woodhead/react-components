import React, { Component, PropTypes } from 'react';
import classname from 'classname';
import keycode from 'keycode';
import Dot from '../dot';

const STATUS = {
  FAIL: 'fail',
  WARNING: 'warning',
  OK: 'ok',
  IDLE: 'idle'
};

const ROOT = 'DotInput';
const INPUT = 'DotInput-input';
const BLOCK = 'DotInput-block';
const CURRENCY = 'DotInput-currency';
const INPUT_FOCUS = 'DotInput-focus';

const timeout = 2000;

export default class DotInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phrase: this.props.phrase,
      firstBlur: false,
      valid: STATUS.IDLE,
      inputFocus: false
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      phrase: newProps.phrase
    });
  }

  phraseChange(event = { currentTarget: { value: '' } }) {
    this.setState({
      phrase: event.currentTarget.value,
      valid: this.props.validator(event.currentTarget.value) ? STATUS.OK : STATUS.FAIL
    }, () => {
      if (this.state.valid === STATUS.FAIL) {
        return;
      }

      setTimeout(() => {
        this.setState({
          valid: STATUS.IDLE
        });
      }, timeout);
    });
  }

  inputBlur() {
    this.setState({
      firstBlur: true,
      valid: this.props.validator(this.state.phrase) ? STATUS.OK : STATUS.FAIL,
      inputFocus: false
    }, () => {
      this.props.submitPhrase(this.state.phrase);
      if (this.state.valid === STATUS.FAIL) {
        return;
      }

      setTimeout(() => {
        this.setState({
          valid: STATUS.IDLE
        });
      }, timeout);
    });
  }

  inputFocus() {
    this.setState({
      inputFocus: true
    });
  }

  escHandler() {
    this.refs.input.blur();
  }

  keyAction(event = { keyCode: '' }) {
    switch (event.keyCode) {
      case keycode.codes.esc:
        this.escHandler(); break;
      default:
    }
  }

  render() {
    return (
      <span ref="root" className={classname([
        ROOT,
        { [this.state.valid]: this.state.firstBlur },
        { [BLOCK]: this.props.block },
        { [INPUT_FOCUS]: this.state.inputFocus }
      ])}
      >{ this.props.currency ? <span className={CURRENCY}>{this.props.currency}</span> : null }
        <input
          ref="input"
          placeholder={this.props.placeholder}
          className={INPUT}
          onChange={::this.phraseChange}
          value={this.state.phrase}
          onKeyUp={::this.keyAction}
          onBlur={::this.inputBlur}
          onFocus={::this.inputFocus}
          type={this.props.type}
        >
        </input>
        <Dot id="123" ref="dot" mode={this.state.valid} dotClick={this.props.dotClick} visible={this.state.firstBlur}/>
      </span>
    );
  }
}

DotInput.defaultProps = {
  phrase: '',
  validator: () => true,
  submitPhrase: par => par,
  dotClick: par => par,
  block: false,
  placeholder: '',
  type: ''
};

DotInput.propTypes = {
  phrase: PropTypes.any,
  validator: PropTypes.func,
  submitPhrase: PropTypes.func,
  dotClick: PropTypes.func,
  block: PropTypes.bool,
  placeholder: PropTypes.string,
  currency: PropTypes.string,
  type: PropTypes.string
};

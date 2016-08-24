import React, { Component, PropTypes } from 'react';
import isUndefined from 'lodash/isUndefined';
import classname from 'classname';

const ROOT = 'TextInput';

class TextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.value ? this.props.value : '',
      pasting: false
    };
  }

  componentWillReceiveProps(newProps) {
    if (!isUndefined(newProps.value)) {
      this.setState({ text: newProps.value });
    }
  }

  handleChange(event) {
    const text = event.target.value;
    this.setState({ text });
    if (this.state.pasting) {
      this.props.onPaste(text);
      this.setState({ pasting: false });
    }

    this.props.onChange(text);
  }

  handlePaste() {
    this.setState({ pasting: true });
  }

  handleFocus(event) {
    const text = event.target.value;
    this.props.onFocus(text);
  }

  onBlur(event) {
    const text = event.target.value;
    this.props.onBlur(text);
  }

  render() {
    return (
      <input
        onChange={::this.handleChange}
        onPaste={::this.handlePaste}
        onFocus={::this.handleFocus}
        onBlur={::this.onBlur}
        value={this.state.text}
        type={this.props.type ? this.props.type : 'text'}
        placeholder={this.props.placeholder}
        className={classname([
          ROOT,
          this.props.className
        ])}
      />
    );
  }
}

TextInput.defaultProps = {
  onChange: par => par,
  onPaste: par => par,
  onFocus: par => par,
  onBlur: par => par
};

TextInput.propTypes = {
  onChange: PropTypes.func,
  onPaste: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string
};

export default TextInput;

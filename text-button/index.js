import React, { Component, PropTypes } from 'react';
import classname from 'classname';

const ROOT = 'TextButton';
const UPPERCASE = 'uppercase';
const TEXT = 'text';
const FILL = 'fill';
const ACTION = 'action';
const ACTION_ALT = 'action-alt';
const GREEN = 'green';
const WHITE = 'white';
const DARK = 'dark';
const DELETE = 'delete';
const HIDE = 'hide';

export default class TextButton extends Component {
  render() {
    return (
      <button
        onClick={this.props.onClick}
        type="button"
        className={classname([
          ROOT,
          this.props.className,
          { [UPPERCASE]: this.props.uppercase },
          { [TEXT]: this.props.text },
          { [FILL]: this.props.fill },
          { [ACTION]: this.props.action },
          { [GREEN]: this.props.green },
          { [DARK]: this.props.dark },
          { [ACTION_ALT]: this.props.actionAlt },
          { [WHITE]: this.props.white },
          { [DELETE]: this.props.deleet },
          { [HIDE]: this.props.hide },
        ])}
      >
        {this.props.children}
      </button>
      );
  }

}

TextButton.defaultProps = {
  onClick: par => par,
  uppercase: false,
  text: false,
  fill: false,
  action: false,
  green: false,
  dark: false,
  actionAlt: false,
  white: false,
  deleet: false,
  hide: false
};

TextButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.any,
  uppercase: PropTypes.bool,
  text: PropTypes.bool,
  fill: PropTypes.bool,
  action: PropTypes.bool,
  green: PropTypes.bool,
  dark: PropTypes.bool,
  actionAlt: PropTypes.bool,
  white: PropTypes.bool,
  deleet: PropTypes.bool,
  hide: PropTypes.bool
};

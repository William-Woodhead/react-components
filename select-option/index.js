import React, { Component, PropTypes } from 'react';
import classname from 'classname';

const ROOT = 'SelectOption';
const LABEL = 'SelectOption-label';
const HIGHLIGHT = 'SelectOption--active';

export default class SelectOption extends Component {
  curryClick(id) {
    return () => {
      this.props.onOptionClick(id);
    };
  }

  render() {
    return (
      <div
        ref="root"
        onMouseDown={this.curryClick(this.props.option.id)}
        className={classname([
          ROOT,
          { [HIGHLIGHT]: this.props.highlight }
        ])}
      >
        <span
          ref="label"
          className={LABEL}
        >{this.props.option.label}</span>
      </div>
    );
  }
}

SelectOption.propTypes = {
  option: PropTypes.object,
  onOptionClick: PropTypes.func,
  highlight: PropTypes.bool
};

SelectOption.defaultProps = {
  option: {
    id: '',
    label: ''
  },
  highlight: false,
  onOptionClick: () => {}
};

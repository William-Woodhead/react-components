import React, { Component, PropTypes } from 'react';

const ROOT = 'Tag';
const LABEL = 'Tag-label';
const CROSS = 'Tag-cross';

export default class SelectedTag extends Component {
  curryClick(id) {
    return () => this.props.onCrossClick(id);
  }

  render() {
    return (
      <span ref="root" className={ROOT}>
        <span
          ref="label"
          className={LABEL}
        >{this.props.tag.label}</span>
        <span
          ref="cross"
          className={CROSS}
          onClick={this.curryClick(this.props.tag.id)}
        >✕</span>
      </span>
    );
  }
}

SelectedTag.propTypes = {
  tag: PropTypes.object,
  onCrossClick: PropTypes.func
};

SelectedTag.defaultProps = {
  tag: {
    id: '',
    label: ''
  },
  onCrossClick: () => {}
};

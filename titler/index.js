import React, { Component, PropTypes } from 'react';
import classname from 'classname';

const ROOT = 'Titler';
const TITLE = 'Titler-title';

export default class Titler extends Component {
  render() {
    return (
      <div ref="root" className={classname([
        ROOT,
        this.props.className
      ])}
      >
      <div ref="title" className={TITLE}>{this.props.title}</div>
        {this.props.children}
      </div>
    );
  }
}

Titler.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  className: PropTypes.string
};

Titler.defaultProps = {
  title: ''
};

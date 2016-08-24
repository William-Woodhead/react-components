import React, { Component, PropTypes } from 'react';
import classname from 'classname';

const STATUS = {
  FAIL: 'fail',
  WARNING: 'warning',
  OK: 'ok',
  IDLE: 'idle'
};

const ROOT = 'Dot';
const VISIBLE = 'Dot--show';
const FAIL_MODE = 'Dot--fail';
const WARNING_MODE = 'Dot--warning';
const OK_MODE = 'Dot--ok';

export default class Dot extends Component {
  constructor(props) {
    super(props);
  }

  clickHandler() {
    this.props.dotClick(this.props.id);
  }

  render() {
    return (
      <span ref="root" className={classname([
        ROOT,
        { [VISIBLE]: this.props.visible && this.props.mode !== STATUS.IDLE },
        { [FAIL_MODE]: this.props.mode === STATUS.FAIL },
        { [WARNING_MODE]: this.props.mode === STATUS.WARNING },
        { [OK_MODE]: this.props.mode === STATUS.OK }
      ])}
        onClick={::this.clickHandler}
      >
        <span className="Dot-circle"></span>
      </span>
    );
  }
}

Dot.defaultProps = {
  dotClick: par => par,
  mode: 'fail',
  visible: false
};

Dot.propTypes = {
  id: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  dotClick: PropTypes.func,
  mode: PropTypes.string,
  visible: PropTypes.bool
};

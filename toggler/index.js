import React, { Component, PropTypes } from 'react';
import classname from 'classname';
import map from 'lodash/map';

const ROOT = 'Toggler';
const OPTION = 'Toggler-option';
const OPTION_ACTIVE = 'Toggler-option--active';
const OPTION_LABEL = 'Toggler-option-label';
const OPTION_SUBTITLE = 'Toggler-option-subtitle';
const OPTION_HAS_SUBTITLE = 'Toggler-option--hasSubtitle';
const OPTION_TEXT = 'Toggler-option-text';
const OPTION_ICON = 'Toggler-option-icon';

export default class Toggler extends Component {
  constructor(props) {
    super(props);
    const { preset, options } = this.props;
    this.state = { active: preset < options.length ? preset : undefined };
  }

  componentWillReceiveProps(newProps) {
    const { preset, options } = newProps;
    this.setState({ active: preset < options.length ? preset : undefined });
  }

  onOptionClick(index, option) {
    return () => {
      const current = index === this.state.active;
      const switchBack = this.props.required ? index : undefined;
      this.setState({ active: current ? switchBack : index });
      if (!current) {
        this.props.onClick(option);
      }

    };
  }

  renderOptions() {
    const { options } = this.props;

    return map(options, (option, index) => {
      return (<div key={index} className={classname([OPTION, { [OPTION_ACTIVE]: this.state.active === index }, { [OPTION_HAS_SUBTITLE]: this.props.subtitle }, `${OPTION}-${index}`])} onClick={::this.onOptionClick(index, option)}>
        {option.icon ? (
          <div className={OPTION_ICON}><img src={option.icon} alt="icon" /></div>
        ) : null}
        <div className={classname([OPTION_LABEL])}>
          <span className={OPTION_TEXT}>{option.label}</span>
        </div>
        {this.props.subtitle ? <br /> : null}
        {this.props.subtitle ? (<div className={OPTION_SUBTITLE}>
          <span className={OPTION_TEXT}>{option.subtitle}</span>
        </div>) : null}
      </div>);
    });
  }

  render() {
    return (
      <div ref="root" className={classname([ROOT, this.props.className])}>
        {::this.renderOptions()}
      </div>
      );
  }

}

Toggler.defaultProps = {
  options: [],
  onClick: fas => fas,
  className: '',
  subtitle: false,
  icon: false,
  required: false
};

// <Toggler options={[{
//   label: 'DAY',
//   id: 'day'
// }, {
//   label: 'WEEK',
//   id: 'week'
// }]} preset={1} />

Toggler.propTypes = {
  className: PropTypes.any,
  options: PropTypes.array,
  onClick: PropTypes.func,
  preset: PropTypes.number,
  subtitle: PropTypes.bool,
  icon: PropTypes.bool,
  required: PropTypes.bool
};

import React, { Component, PropTypes } from 'react';
import classname from 'classname';
import size from 'lodash/size';
import map from 'lodash/map';
import range from 'lodash/range';

const ROOT = 'Carousel';
const CAROUSEL_ITEM = 'Carousel-Item';
const SHOW = 'Carousel-Item--show';
const ARROW = 'Carousel-Arrow';
const ARROW_LEFT = 'Carousel-Arrow--left';
const ARROW_RIGHT = 'Carousel-Arrow--right';
const ARROW_CHAR = 'Carousel-ArrowCharacter';
const CAROUSEL_DOT = 'Carousel-Dot';
const DOT_HIGHLIGHT = 'Carousel-Dot--highlight';
const DOTS = 'Carousel-Dots';

export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0
    };
  }

  componentWillReceiveProps(newProps) {
    if (size(newProps.children) >= this.state.currentIndex) {
      this.setState({ currentIndex: 0 });
    }
  }

  renderItems() {
    return map(this.props.children, (child, index) => {
      return (
        <div className={classname([CAROUSEL_ITEM, { [SHOW]: index === this.state.currentIndex }])}>
          {child}
        </div>
      );
    });
  }

  renderDots() {
    const number = size(this.props.children);
    return (
      <div className={DOTS}>
      {map(range(number), (index) => {
        return <div className={classname([CAROUSEL_DOT, { [DOT_HIGHLIGHT]: index === this.state.currentIndex }])} />;
      })}
      </div>
    );
  }

  onDecrementClick() {
    const index = this.state.currentIndex;
    const total = size(this.props.children);
    const newIndex = index === 0 ? total - 1 : index - 1;
    this.setState({
      currentIndex: newIndex
    });
  }

  onIncrementClick() {
    const index = this.state.currentIndex;
    const total = size(this.props.children);
    const newIndex = index === total - 1 ? 0 : index + 1;
    this.setState({
      currentIndex: newIndex
    });
  }

  renderLeftArrow() {
    return <div className={classname([ARROW, ARROW_LEFT])} onClick={::this.onDecrementClick}><span className={ARROW_CHAR}>◀</span></div>;
  }

  renderRightArrow() {
    return <div className={classname([ARROW, ARROW_RIGHT])} onClick={::this.onIncrementClick}><span className={ARROW_CHAR}>▶</span></div>;
  }

  render() {
    return (
      <div ref="root" className={ROOT}>
        {::this.renderItems()}
        {::this.renderDots()}
        {::this.renderLeftArrow()}
        {::this.renderRightArrow()}
      </div>
    );
  }
}

Carousel.propTypes = {
  children: PropTypes.any
};

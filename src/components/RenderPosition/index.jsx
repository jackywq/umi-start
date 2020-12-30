import React from 'react';

export default class RenderPosition extends React.PureComponent {
  warpRef;

  state = {
    domHeight: 0,
  };

  constructor(props) {
    super(props);
    this.warpRef = React.createRef();
  }

  componentDidMount() {
    this.calcDomHeight();
    window.addEventListener('resize', this.calcDomHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.calcDomHeight);
  }

  // componentDidupdate配合componentDidMount一起执行calcDomHeight方法，为了修复componentDidMount方法里面使用setTimeout导致页面闪跳问题；
  componentDidUpdate(prevProps, prevState) {
    if (prevState.domHeight !== this.state.domHeight) {
      setTimeout(() => {
        this.calcDomHeight();
      }, 150);
    }
  }

  // 动态计算DOM高度
  calcDomHeight = () => {
    const current = this.warpRef.current;
    try {
      const rect = current && current.getClientRects();
      const top = (rect && rect[0].top) || 0;
      this.setState({
        domHeight: window.innerHeight - top - 60, // 60指的是分页组件高度
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  render() {
    const { domHeight } = this.state;
    const { children } = this.props;
    if (typeof children !== 'function') {
      return null;
    }
    return <div ref={this.warpRef}>{children(domHeight)}</div>;
  }
}

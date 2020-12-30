import React, { Component } from 'react';
import { Slider } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.less';

export default class TableSlider extends Component {
  static propTypes = {};

  tableScrollX = 0; // table滚动条宽度

  state = {
    sliderValue: 0, // slider滚动条滚动距离
  };

  componentDidMount() {
    this.tableBody = document.querySelector(
      '#commonTable .ant-table .ant-table-scroll .ant-table-body',
    );

    this.subsribeTableScroll();
    this.subscribeWindowResize();
  }

  componentWillUnmount() {
    this.tableBody.removeEventListener('scroll', () => {});
    window.removeEventListener('resize', () => {});
  }

  // 每次更新dom后，重新计算table的滚动宽度
  componentDidUpdate() {
    const tableScrollWidth = this.tableBody.scrollWidth;
    const tableClientWidth = this.tableBody.clientWidth;
    this.tableScrollX = Math.floor(tableScrollWidth - tableClientWidth);
  }

  // 浏览器宽度改变, 重置滚动距离
  subscribeWindowResize = () => {
    window.addEventListener('resize', () => {
      this.tableBody.scrollTo(0, 0);
      this.setState({
        sliderValue: 0,
      });
    });
  };

  // 监听table滚动
  subsribeTableScroll = () => {
    this.tableBody.addEventListener('scroll', e => {
      const { scrollLeft } = e.target;
      this.setState({
        sliderValue: (scrollLeft / this.tableScrollX) * 100,
      });
    });
  };

  handleSliderChange = value => {
    this.setState({
      sliderValue: value,
    });

    const scrollToDistance = Math.floor((this.tableScrollX * value) / 100);
    this.tableBody && this.tableBody.scrollTo(scrollToDistance, this.tableBody.scrollTop);
  };

  render() {
    const { sliderValue } = this.state;

    return (
      <Slider
        className={styles.slider}
        tipFormatter={() => '可拖动此滑块，横向滚动表格'}
        value={sliderValue}
        onChange={this.handleSliderChange}
      />
    );
  }
}

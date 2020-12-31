import React from 'react';
import { Icon, Tooltip } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';

const GlobalHeaderRight = props => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        onSearch={value => {
          // console.log('input', value);
        }}
        onPressEnter={value => {
          // console.log('enter', value);
        }}
      />
      <Avatar />
    </div>
  );
};

GlobalHeaderRight.propTypes = {
  theme: PropTypes.string.isRequired,
  layout: PropTypes.string.isRequired,
};

export default connect(({ settings }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);

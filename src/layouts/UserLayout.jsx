import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import styles from './UserLayout.less';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  return (
    <DocumentTitle
      title={getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        ...props,
      })}
    >
      <div className={styles.container}>
        <div className={styles.content}>{children}</div>
        <DefaultFooter />
      </div>
    </DocumentTitle>
  );
};

UserLayout.propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.arrayOf(),
  }).isRequired,
  children: PropTypes.element.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import SiteInfo from 'constants/SiteInfo.json';

/**
 * Component that manages changes to document head
 * currently we are editing only title, but you can add meta description, image ...
 */
const Head = ({ title, desc }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={desc} />
  </Helmet>
);

Head.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string,
};

Head.defaultProps = {
  title: SiteInfo.name,
};

export default Head;

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const Loader = ({ finishLoading }) => {
  useEffect(() => {
    finishLoading();
  }, []);

  return null;
};

Loader.propTypes = {
  finishLoading: PropTypes.func.isRequired,
};

export default Loader;

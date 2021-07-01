import { useEffect } from 'react';

/**
 * Scrolls to top on mount
 */
const ScrollToTopOnMount = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
};

export default ScrollToTopOnMount;

import React from 'react';
import theme from 'theme';

/**
 * Course (books) icon
 *
 * @param {string} width
 * @param {string} color
 */
export const CourseIcon = ({ width, color }) => {
  const DEFAULT_WIDTH = '14';
  const DEFAULT_COLOR = theme.colors.text.secondary;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || DEFAULT_WIDTH}
      viewBox="0 0 24 24"
      fill={theme.colors[color] || DEFAULT_COLOR}
    >
      {/* <path d="M0 0h24v24H0z" fill="none" /> */}
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
    </svg>
  );
};

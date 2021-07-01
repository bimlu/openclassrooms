import React from 'react';
import theme from 'theme';

/**
 * Programme (degree-hat) icon
 *
 * @param {string} width
 * @param {string} color
 */
export const ProgrammeIcon = ({ width, color }) => {
  const DEFAULT_WIDTH = '16';
  const DEFAULT_COLOR = theme.colors.text.secondary;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || DEFAULT_WIDTH}
      viewBox="0 0 24 24"
      fill={theme.colors[color] || DEFAULT_COLOR}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
    </svg>
  );
};

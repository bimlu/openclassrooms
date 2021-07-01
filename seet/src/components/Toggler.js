import React from 'react';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import IconButton from '@material-ui/core/IconButton';

export default function Toggler({ toggleTheme }) {
  return (
    <IconButton onClick={toggleTheme} color="default" aria-label="toggle dark mode">
      <Brightness4Icon />
    </IconButton>
  );
}

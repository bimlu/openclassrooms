import React from 'react';
import { useApolloClient } from '@apollo/client';

import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';

import { useStore } from 'store';
import { CLEAR_AUTH_USER } from 'store/auth';

/**
 * Component that signs out the user
 */
const SignOut = ({ handleClick }) => {
  const client = useApolloClient();
  const [, dispatch] = useStore();

  const handleSignOut = () => {
    handleClick();
    dispatch({ type: CLEAR_AUTH_USER });
    client.resetStore();
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/signout`;
  };

  return (
    <MenuItem dense onClick={handleSignOut}>
      <IconButton
        aria-label="sign out"
        aria-controls="primary-search-account-menu"
        aria-haspopup="true"
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <p>Sign out</p>
    </MenuItem>
  );
};

export default SignOut;

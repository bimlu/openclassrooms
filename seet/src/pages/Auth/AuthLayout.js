import React, { useState } from 'react';

import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LinearProgress from '@material-ui/core/LinearProgress';
import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';

import { GoogleIcon } from 'components/icons';
// import { FacebookIcon } from 'components/icons';
// import { GithubIcon } from 'components/icons';
import Head from 'components/Head';

import * as Routes from 'routes';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    color: '#4285f4',
    borderRadius: theme.spacing(5),
    padding: theme.spacing(1.7),
    background: theme.palette.background.paper,
    marginBottom: theme.spacing(1.7),
    textTransform: 'none',
  },
  avatar: {
    // backgroundColor: theme.palette.primary.light,
  },
}));

/**
 * Main Layout for the app, when user isn't authenticated
 */
const AuthLayout = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  return (
    <Container component="main" maxWidth="sm" className={classes.root}>
      <Head title="Sign in" desc="Sign in to bimlee.com" />

      <Box mt={12}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
      </Box>

      <Box mt={10}>
        <Box my={2}>{loading && <LinearProgress color="primary" />}</Box>

        {/* <Button
          href={`${process.env.REACT_APP_API_URL}/auth/facebook`}
          color="primary"
          className={classes.button}
          startIcon={<FacebookIcon />}
          fullWidth
          onClick={() => setLoading(true)}
          disabled={loading}
        >
          Continue with Facebook
        </Button> */}

        <Button
          href={`${process.env.REACT_APP_API_URL}/auth/google`}
          color="primary"
          className={classes.button}
          startIcon={<GoogleIcon width={22} />}
          fullWidth
          onClick={() => setLoading(true)}
          disabled={loading}
        >
          Continue with Google
        </Button>

        {/* <Button
          href={`${process.env.REACT_APP_API_URL}/auth/github`}
          color="primary"
          className={classes.button}
          startIcon={<GithubIcon />}
          fullWidth
          onClick={() => setLoading(true)}
          disabled={loading}
        >
          Continue with Github
        </Button> */}

        <Button
          href={Routes.HOME}
          color="primary"
          className={classes.button}
          startIcon={<ArrowBackIcon />}
          fullWidth
          onClick={() => setLoading(true)}
          disabled={loading}
        >
          Go back to Home page
        </Button>
      </Box>

      <Box mt={8}>
        <Typography variant="caption" color="textSecondary">
          {'© '}
          {new Date().getFullYear()}{' '}
          <Link color="inherit" href={Routes.HOME}>
            bimlee.com
          </Link>
          {' - '}
          <Link color="inherit" href={Routes.PRIVACY_POLICY}>
            Privacy Policy
          </Link>
        </Typography>
      </Box>

      <Box>
        <Link color="textSecondary" variant="caption" href={Routes.TERMS_AND_CONDITIONS}>
          Terms and Conditions
        </Link>
      </Box>

      <Box>
        <Link color="textSecondary" variant="caption" href={Routes.ABOUT_US}>
          About
        </Link>

        {' . '}

        <Link color="textSecondary" variant="caption" href={Routes.CONTACT_US}>
          Contact Us
        </Link>
      </Box>

      <Box>
        <Typography color="textSecondary" variant="caption">
          Made with ❤️ in Dehradun
        </Typography>
      </Box>
    </Container>
  );
};

export default AuthLayout;

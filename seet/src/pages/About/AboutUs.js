import React from 'react';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import Head from 'components/Head';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const AboutUs = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="md" className={classes.root}>
      <Head title="About Us" desc="About Us" />

      <Box mt={2}>
        <Typography paragraph variant="body2">
          <b>ABOUT US</b>
        </Typography>
      </Box>

      <Divider style={{ width: '100%' }} />

      <Box mt={2}>
        <Typography paragraph variant="caption">
          Hi 😍, It's my college project 😂
        </Typography>
        <Typography paragraph variant="caption">
          More info coming soon!
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUs;

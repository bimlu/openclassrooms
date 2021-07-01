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

const ContactUs = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="md" className={classes.root}>
      <Head title="Contact Us" desc="Contact Us" />

      <Box mt={2}>
        <Typography paragraph variant="body2">
          <b>CONTACT US</b>
        </Typography>
      </Box>

      <Divider style={{ width: '100%' }} />

      <Box mt={2}>
        <Typography paragraph variant="caption">
          Email us at bimlee.official@gmail.com
        </Typography>
        <Typography paragraph variant="caption">
          More info coming soon!
        </Typography>
      </Box>
    </Container>
  );
};

export default ContactUs;

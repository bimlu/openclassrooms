import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Alert from '@material-ui/lab/Alert';

import Head from 'components/Head';
import CollegesTreeView from 'components/CollegesTreeView';
// import SpeedDial from 'components/SpeedDial';
import ScrollManager from 'components/ScrollManager';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    background: theme.palette.background.default,
    marginBottom: theme.spacing(2),
    minHeight: 486,
    [theme.breakpoints.down('sm')]: {
      minHeight: '100%',
    },
  },
  divider: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  alert: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(2),
  },
}));

const Home = () => {
  const classes = useStyles();
  const { pathname, search } = useLocation();
  const [selectedNodeValue, setSelectedNodeValue] = useState('');

  return (
    <div className={classes.root}>
      <Alert severity="info" className={classes.alert}>
        The Site is in development mode. some functionality might not work as expected.
      </Alert>

      <ScrollManager scrollKey={`${pathname}${search}`} />

      <Paper className={classes.paper} elevation={0}>
        <Typography variant="body2">Quick links for College, Programme and Courses</Typography>

        <Divider className={classes.divider} />

        <Box mt={2} mb={8}>
          <CollegesTreeView selectedNodeValue={selectedNodeValue} setSelectedNodeValue={setSelectedNodeValue} />
        </Box>

        <Typography variant="h5" color="textSecondary">
          Recommended Posts
        </Typography>

        <Divider className={classes.divider} />

        <Typography variant="caption" color="textSecondary">
          Recommended Posts appear here 👇 (this functionality should come in future updates)
        </Typography>
      </Paper>

      {/* <SpeedDial /> */}

      <Head title="bimlee" />
    </div>
  );
};

export default Home;

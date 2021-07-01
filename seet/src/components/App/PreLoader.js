import React from 'react';

import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
  paper: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  logo: {
    fontSize: 40,
  },
}));

const PreLoader = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography className={classes.logo}>bimlee</Typography>
    </Paper>
  );
};

export default PreLoader;

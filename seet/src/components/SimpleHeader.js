import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import { HEADER_HEIGHT } from 'constants/Layout';

const useStyles = makeStyles((theme) => ({
  header: {
    height: `${HEADER_HEIGHT}px`,
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: theme.zIndex.appBar + 1,
      background: theme.palette.background.paper,
    },
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  heading: {
    fontSize: theme.spacing(3.6),
    fontWeight: 'bold',
    display: 'inline',
    marginLeft: theme.spacing(1),
  },
}));

const SimpleHeader = ({ heading, loading }) => {
  const classes = useStyles();

  return (
    <div className={classes.header}>
      <IconButton aria-label="go back" onClick={() => history.back()}>
        <ArrowBackIcon />
      </IconButton>

      <Typography className={classes.heading}>{heading}</Typography>

      {loading && <LinearProgress color="primary" />}
    </div>
  );
};

export default SimpleHeader;

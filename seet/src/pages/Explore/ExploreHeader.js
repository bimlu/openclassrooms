import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import BreadcrumbsNav from 'components/BreadcrumbsNav';

import { HEADER_HEIGHT } from 'constants/Layout';

const useStyles = makeStyles((theme) => ({
  box: {
    position: 'sticky',
    top: HEADER_HEIGHT + 12,
    zIndex: theme.zIndex.appBar + 1,
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(0),
    background: theme.palette.background.default,
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: theme.palette.background.paper,
    },
  },
}));

const ExploreHeader = () => {
  const classes = useStyles();

  return (
    <Box className={classes.box} p={2}>
      <BreadcrumbsNav />
    </Box>
  );
};

export default ExploreHeader;

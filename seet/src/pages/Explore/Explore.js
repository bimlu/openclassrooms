import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import BreadcrumbsNav from 'components/BreadcrumbsNav';

import Colleges from 'pages/College/Colleges';
import Programmes from 'pages/Programme/Programmes';
import Courses from 'pages/Course/Courses';
import Posts from 'pages/Post/Posts';
import HideOnScroll from 'components/App/Header/HideOnScroll';

import { HEADER_HEIGHT } from 'constants/Layout';

import * as Routes from 'routes';

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

const Explore = () => {
  const classes = useStyles();

  return (
    <>
      <HideOnScroll>
        <Box className={classes.box} px={0.4} py={2}>
          <BreadcrumbsNav />
        </Box>
      </HideOnScroll>

      <Switch>
        <Route path={Routes.POSTS}>
          <Posts />
        </Route>

        <Route path={Routes.COURSES}>
          <Courses />
        </Route>

        <Route path={Routes.PROGRAMMES}>
          <Programmes />
        </Route>

        <Route path={Routes.COLLEGES}>
          <Colleges />
        </Route>

        <Redirect to={Routes.COLLEGES} />
      </Switch>
    </>
  );
};

export default Explore;

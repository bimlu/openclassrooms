import React, { useEffect, useState } from 'react';
import { Link, generatePath, useLocation } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import HomeIcon from '@material-ui/icons/HomeRounded';
import ExploreIcon from '@material-ui/icons/ExploreRounded';
import StudentsIcon from '@material-ui/icons/PeopleRounded';
import ProfileIcon from '@material-ui/icons/PersonRounded';

import { BOTTOM_NAV_HEIGHT } from 'constants/Layout';

import * as Routes from 'routes';
import { useStore } from 'store';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: `${BOTTOM_NAV_HEIGHT}px`,
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.md,
    borderTop: `1px dotted ${theme.palette.text.secondary}`,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function SimpleBottomNavigation() {
  const [{ auth, route }] = useStore();
  const classes = useStyles();
  const { pathname } = useLocation();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (pathname === Routes.HOME) {
      setValue(0);
    } else if (
      pathname === Routes.COLLEGES ||
      pathname === Routes.PROGRAMMES ||
      pathname === Routes.COURSES ||
      pathname === Routes.POSTS
    ) {
      setValue(1);
    } else if (pathname === Routes.AUTH) {
      setValue(3);
    } else if (auth.user && pathname.includes(auth.user.id)) {
      setValue(3);
    } else if (pathname === Routes.PEOPLE) {
      setValue(2);
    } else if (!pathname.slice(1).includes('/')) {
      setValue(2);
    } else {
      setValue(null);
    }
  }, [pathname]);

  return (
    <BottomNavigation
      value={value}
      onChange={(_event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction component={Link} to={Routes.HOME} label="Home" icon={<HomeIcon fontSize="small" />} />
      <BottomNavigationAction
        component={Link}
        to={value === 1 ? Routes.COLLEGES : route.explore}
        label="Explore"
        icon={<ExploreIcon fontSize="small" />}
        fontSize="small"
      />
      <BottomNavigationAction
        component={Link}
        to={value === 2 ? Routes.PEOPLE : route.people}
        label="Students"
        icon={<StudentsIcon />}
        fontSize="small"
      />
      <BottomNavigationAction
        component={Link}
        to={auth.user ? generatePath(Routes.USER_PROFILE, { id: auth.user.id }) : Routes.LOG_IN}
        label="Profile"
        icon={<ProfileIcon fontSize="small" />}
      />
    </BottomNavigation>
  );
}

import React, { useState, useEffect } from 'react';
import { generatePath, Link, useLocation } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/HomeRounded';
import ExploreIcon from '@material-ui/icons/Explore';
import PeopleIcon from '@material-ui/icons/PeopleRounded';
import NotificationIcon from '@material-ui/icons/NotificationsRounded';
import MessageIcon from '@material-ui/icons/MailRounded';

import { HEADER_HEIGHT } from 'constants/Layout';

import { useStore } from 'store';
import * as Routes from 'routes';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'sticky',
    top: HEADER_HEIGHT + 12,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(2),
    minHeight: 600,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  listItem: {
    borderRadius: theme.spacing(2),
    '&:hover': {
      background: theme.palette.background.default,
    },
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

/**
 * Displays left side bar
 */
const SideBar = () => {
  const classes = useStyles();
  const [{ auth, route }] = useStore();
  const { pathname } = useLocation();
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (pathname === Routes.HOME) {
      setSelected('home');
    } else if (
      pathname === Routes.COLLEGES ||
      pathname === Routes.PROGRAMMES ||
      pathname === Routes.COURSES ||
      pathname === Routes.POSTS
    ) {
      setSelected('explore');
    } else if (pathname.split('/')[1] === 'messages') {
      setSelected('messages');
    } else if (pathname === Routes.NOTIFICATIONS) {
      setSelected('notifications');
    } else if (pathname === Routes.AUTH) {
      setSelected('profile');
    } else if (auth.user && pathname.includes(auth.user.id)) {
      setSelected('profile');
    } else if (pathname === Routes.PEOPLE) {
      setSelected('students');
    } else if (!pathname.slice(1).includes('/')) {
      setSelected('students');
    } else {
      setSelected('');
    }
  }, [pathname]);

  return (
    <Paper className={classes.paper} elevation={2}>
      <List>
        {auth.user && (
          <ListItem
            className={classes.listItem}
            component={Link}
            to={generatePath(Routes.USER_PROFILE, { id: auth.user.id })}
            selected={selected === 'profile'}
          >
            <ListItemIcon>
              <Avatar alt={auth.user.fullName} src={auth.user.image} />
            </ListItemIcon>
            <ListItemText secondary={auth.user.fullName} />
          </ListItem>
        )}

        <Divider className={classes.divider} />

        <ListItem className={classes.listItem} component={Link} to={Routes.HOME} selected={selected === 'home'}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText secondary="Home" />
        </ListItem>

        <ListItem
          className={classes.listItem}
          component={Link}
          to={selected === 'explore' ? Routes.COLLEGES : route.explore}
          selected={selected === 'explore'}
        >
          <ListItemIcon>
            <ExploreIcon />
          </ListItemIcon>
          <ListItemText secondary="Explore" />
        </ListItem>

        <ListItem
          className={classes.listItem}
          component={Link}
          to={selected === 'students' ? Routes.PEOPLE : route.people}
          selected={selected === 'students'}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText secondary="Students" />
        </ListItem>

        {auth.user && (
          <ListItem
            className={classes.listItem}
            component={Link}
            to={Routes.NOTIFICATIONS}
            selected={selected === 'notifications'}
          >
            <ListItemIcon>
              <NotificationIcon />
            </ListItemIcon>
            <ListItemText secondary="Notifications" />
          </ListItem>
        )}

        {auth.user && (
          <ListItem
            className={classes.listItem}
            component={Link}
            to={generatePath(Routes.MESSAGES, { userId: Routes.NEW_ID_VALUE })}
            selected={selected === 'messages'}
          >
            <ListItemIcon>
              <MessageIcon />
            </ListItemIcon>
            <ListItemText secondary="Messages" />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

export default SideBar;

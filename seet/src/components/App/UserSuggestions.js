import React from 'react';
import { Link, generatePath } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';

import { HEADER_HEIGHT } from 'constants/Layout';

import { USER_SUGGESTIONS } from 'graphql/user';
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
  title: {
    textAlign: 'center',
    margin: theme.spacing(1),
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  listItem: {
    borderRadius: theme.spacing(2),
    '&:hover': {
      color: theme.palette.text.primary,
      '& *': {
        color: 'inherit',
      },
    },
  },
}));

/**
 * Displays user suggestions
 */
const UserSuggestions = () => {
  const classes = useStyles();
  const [{ auth }] = useStore();

  const { data, loading, error } = useQuery(USER_SUGGESTIONS, {
    variables: { userId: auth.user.id },
  });

  if (error) return 'Please check your internet connection';

  return (
    <Paper className={classes.paper} elevation={2}>
      <Typography className={classes.title}>Suggestions For You</Typography>
      <Divider className={classes.divider} />

      {loading ? (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      ) : (
        <List>
          {data.suggestPeople.map((user) => (
            <ListItem
              className={classes.listItem}
              key={user.id}
              component={Link}
              to={generatePath(Routes.USER_PROFILE, { id: user.id })}
            >
              <ListItemIcon>
                <Avatar atl={user.fullName} src={user.image} />
              </ListItemIcon>
              <ListItemText secondary={user.fullName} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default UserSuggestions;

import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import * as Routes from 'routes';
import { useStore } from 'store';
import Head from 'components/Head';

import MessagesUsers from './MessagesUsers';
import MessagesChat from './MessagesChat';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    borderRadius: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    height: '80vh',
  },
}));

/**
 * Messages page
 */
const Messages = () => {
  const match = useRouteMatch();
  const classes = useStyles();
  const [{ auth }] = useStore();

  if (!auth.user) {
    return <Redirect to={Routes.HOME} />;
  }

  return (
    <Paper className={classes.paper} elevation={2}>
      <Head title="Messages" />

      <MessagesUsers authUser={auth.user} match={match} />

      <MessagesChat match={match} authUser={auth.user} />
    </Paper>
  );
};

export default Messages;

import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import { currentDate } from 'utils/date';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'relative',
    justifyContent: (props) => props.userMessage && 'flex-end',
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(1),
  },
  message: {
    background: (props) => props.userMessage && theme.palette.primary.light,
    borderRadius: theme.spacing(2),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    wordWrap: 'break-word',
    maxWidth: 160,
    minWidth: 32,
  },
  messageDate: {
    position: 'absolute',
    bottom: -theme.spacing(2),
    color: theme.palette.text.secondary,
    fontSize: theme.spacing(1.3),
  },
  avatar: {
    width: 32,
    height: 32,
  },
}));

/**
 * Component that renders messages conversations UI
 */
const SingleMessageBox = ({ message, isAuthUserReceiver }) => {
  const classes = useStyles({ userMessage: isAuthUserReceiver });

  return (
    <ListItem className={classes.root} key={message.id}>
      <ListItemAvatar>
        <Avatar alt={message.sender.fullName} src={message.sender.image} className={classes.avatar} />
      </ListItemAvatar>

      <Paper className={classes.message} elevation={2}>
        {message.message}
      </Paper>

      <Typography className={classes.messageDate}>{currentDate(message.createdAt)}</Typography>
    </ListItem>
  );
};

SingleMessageBox.propTypes = {
  message: PropTypes.object.isRequired,
  isAuthUserReceiver: PropTypes.bool.isRequired,
};

export default SingleMessageBox;

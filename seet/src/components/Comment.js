import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { Link, generatePath } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import CancelIcon from '@material-ui/icons/Cancel';
import FaceIcon from '@material-ui/icons/Face';

import { GET_AUTH_USER, GET_USER } from 'graphql/user';
import { DELETE_COMMENT } from 'graphql/comment';
import { GET_POST, GET_POSTS, GET_FOLLOWED_POSTS } from 'graphql/post';

import { useNotifications } from '../hooks/useNotifications';

import { useStore } from 'store';

import * as Routes from 'routes';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  chip: {
    maxWidth: '100%',
    height: 'max-content',
  },
  label: {
    whiteSpace: 'normal',
    height: '100%',
    padding: theme.spacing(0.8),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.3),
  },
}));

const Label = ({ fullName, comment }) => {
  return (
    <span>
      <b>{fullName}</b> {comment}
    </span>
  );
};

/**
 * Renders comments UI
 */
const Comment = ({ comment, postId, postAuthor }) => {
  const classes = useStyles();
  const [{ auth }] = useStore();
  const notification = useNotifications();
  const [deleteComment, { loading }] = useMutation(DELETE_COMMENT, {
    refetchQueries: [
      { query: GET_FOLLOWED_POSTS, variables: { userId: auth.user && auth.user.id } },
      { query: GET_USER, variables: { userId: comment.author.id } },
      { query: GET_AUTH_USER },
      { query: GET_POSTS, variables: { authUserId: auth.user && auth.user.id } },
      { query: GET_POST, variables: { id: postId } },
    ],
  });

  const handleDeleteComment = async () => {
    if (!auth.user) return;

    if (comment.author.id !== auth.user.id) return;

    await deleteComment({ variables: { input: { id: comment.id } } });

    // Delete notification after comment deletion
    if (auth.user.id !== postAuthor.id) {
      const isNotified = postAuthor.notifications.find((n) => n.comment && n.comment.id === comment.id);
      notification.remove({
        notificationId: isNotified.id,
      });
    }
  };

  return (
    <div className={classes.root}>
      <Chip
        classes={{
          root: classes.chip,
          label: classes.label,
        }}
        variant="outlined"
        color="default"
        disabled={loading}
        avatar={
          <Avatar
            alt={comment.author.fullName}
            src={comment.author.image || 'show first letter of fullName'}
            component={Link}
            to={generatePath(Routes.USER_PROFILE, { id: comment.author.id })}
          />
        }
        label={<Label fullName={comment.author.fullName} comment={comment.comment} />}
        onDelete={handleDeleteComment}
        deleteIcon={auth.user && comment.author.id === auth.user.id ? <CancelIcon /> : <FaceIcon />}
      />
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  postAuthor: PropTypes.object.isRequired,
};

export default Comment;

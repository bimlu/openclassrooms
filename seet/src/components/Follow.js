import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { GET_FOLLOWED_POSTS, GET_POSTS } from 'graphql/post';
import { GET_AUTH_USER, GET_USER } from 'graphql/user';
import { CREATE_FOLLOW, DELETE_FOLLOW } from 'graphql/follow';

import { NotificationType } from 'constants/NotificationType';
import { HOME_PAGE_POSTS_LIMIT } from 'constants/DataLimit';

import { useStore } from 'store';

import * as Routes from 'routes';

import { useNotifications } from 'hooks/useNotifications';

const useStyles = makeStyles((theme) => ({
  button: {
    fontSize: theme.spacing(1.4),
    padding: '6px 20px',
  },
}));

/**
 * Component for rendering follow button
 */
const Follow = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const [{ auth }] = useStore();
  const notification = useNotifications();
  const isFollowing = auth.user && auth.user.following.find((f) => f.user === user.id);
  // Detect which mutation to use
  const operation = isFollowing ? 'delete' : 'create';
  const options = {
    create: {
      mutation: CREATE_FOLLOW,
      variables: { userId: user.id, followerId: auth.user && auth.user.id },
    },
    delete: {
      mutation: DELETE_FOLLOW,
      variables: { id: isFollowing ? isFollowing.id : null },
    },
  };
  const [mutate] = useMutation(options[operation].mutation, {
    refetchQueries: [
      { query: GET_AUTH_USER },
      { query: GET_POSTS, variables: { authUserId: auth.user && auth.user.id } },
      {
        query: GET_FOLLOWED_POSTS,
        variables: {
          userId: auth.user && auth.user.id,
          skip: 0,
          limit: HOME_PAGE_POSTS_LIMIT,
        },
      },
      { query: GET_USER, variables: { userId: user.id } },
    ],
  });

  const handleClickFollow = async () => {
    if (!auth.user) {
      return;
    }

    setLoading(true);
    const { data } = await mutate({
      variables: { input: { ...options[operation].variables } },
    });

    // Create or Delete mutation for follow
    if (auth.user.id === user.id) return setLoading(false);
    await notification.toggle({
      user,
      hasDone: isFollowing,
      notificationType: NotificationType.FOLLOW,
      notificationTypeId: data.createFollow ? data.createFollow.id : null,
    });
    setLoading(false);
  };

  return (
    <Button
      size="small"
      variant={isFollowing ? 'outlined' : 'contained'}
      color="primary"
      component={Link}
      to={auth.user ? '#' : Routes.AUTH}
      onClick={handleClickFollow}
      disabled={loading}
      className={classes.button}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
};

Follow.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Follow;

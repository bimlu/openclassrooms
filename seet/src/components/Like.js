import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { Link, useLocation } from 'react-router-dom';

import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { GET_FOLLOWED_POSTS, GET_POSTS } from 'graphql/post';
import { GET_AUTH_USER } from 'graphql/user';
import { CREATE_LIKE, DELETE_LIKE } from 'graphql/like';

import { NotificationType } from 'constants/NotificationType';

import { useNotifications } from 'hooks/useNotifications';

import { useStore } from 'store';

import * as Routes from 'routes';

/**
 * Component for rendering Like button
 */
const Like = ({ postId, user, likes, StyledBadge, buttonClass }) => {
  const [loading, setLoading] = useState(false);
  const { pathname, search, hash } = useLocation();

  const [{ auth }] = useStore();

  const notification = useNotifications();
  // Detect which mutation to use
  const hasLiked = auth.user && likes.find((l) => l.user === auth.user.id && l.post === postId);
  const [localLike, setLocalLike] = useState(hasLiked);
  const operation = hasLiked ? 'delete' : 'create';
  const options = {
    create: {
      mutation: CREATE_LIKE,
      variables: { postId, userId: auth.user && auth.user.id },
    },
    delete: {
      mutation: DELETE_LIKE,
      variables: { id: hasLiked ? hasLiked.id : null },
    },
  };
  const [mutate] = useMutation(options[operation].mutation, {
    refetchQueries: [
      { query: GET_AUTH_USER },
      { query: GET_POSTS, variables: { authUserId: auth.user && auth.user.id } },
      { query: GET_FOLLOWED_POSTS, variables: { userId: auth.user && auth.user.id } },
    ],
  });

  const handleButtonClick = async () => {
    if (!auth.user) {
      return;
    }

    setLocalLike(!localLike);

    if (loading) return;

    setLoading(true);
    const { data } = await mutate({
      variables: { input: { ...options[operation].variables } },
    });

    // Create or delete notification for like
    if (auth.user.id === user.id) return setLoading(false);
    await notification.toggle({
      user,
      postId,
      hasDone: hasLiked,
      notificationType: NotificationType.LIKE,
      notificationTypeId: data.createLike ? data.createLike.id : null,
    });
    setLoading(false);
  };

  return (
    <IconButton
      component={Link}
      to={auth.user ? `${pathname}${search}${hash}` : Routes.AUTH}
      onClick={() => handleButtonClick(mutate)}
      className={buttonClass}
    >
      <StyledBadge badgeContent={likes.length} max={9999}>
        <FavoriteIcon style={localLike ? { color: '#e91e63' } : { color: '' }} />
      </StyledBadge>
    </IconButton>
  );
};

Like.propTypes = {
  postId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  likes: PropTypes.array,
};

export default Like;

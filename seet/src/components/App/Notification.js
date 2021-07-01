import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';
import { useApolloClient } from '@apollo/client';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

import { A } from 'components/Text';
import { Spacing } from 'components/Layout';
import Avatar from 'components/Avatar';

import { useClickOutside } from 'hooks/useClickOutside';

import { GET_AUTH_USER } from 'graphql/user';
import { UPDATE_NOTIFICATION_SEEN } from 'graphql/notification';

import { useStore } from 'store';

import * as Routes from 'routes';

const DEFAULT_THUMBNAIL = 'https://jhimlish-dev-4.s3.ap-south-1.amazonaws.com/default/pdf-thumbnail.jpg';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    borderRadius: theme.spacing(1),
  },
}));

const LeftSide = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Action = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  margin-left: ${(p) => p.theme.spacing.xs};
`;

const PostImage = styled.div`
  width: 40px;
  height: 40px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

/**
 * Renders user notifications
 */
const Notification = ({ notification, close, loading }) => {
  const classes = useStyles();
  const [{ auth }] = useStore();
  const client = useApolloClient();
  const ref = React.useRef(null);

  useClickOutside(ref, close);

  if (loading) {
    return <Skeleton variant="rect" className={classes.paper} height={100} />;
  }

  useEffect(() => {
    const updateNotificationSeen = async () => {
      try {
        await client.mutate({
          mutation: UPDATE_NOTIFICATION_SEEN,
          variables: {
            input: {
              userId: auth.user.id,
            },
          },
          refetchQueries: () => [{ query: GET_AUTH_USER }],
        });
      } catch (err) {
        console.log(err);
      }
    };

    updateNotificationSeen();
  }, [auth.user.id, auth.user.newNotifications.length, client]);

  if (!notification.follow && !notification.like && !notification.comment) {
    return null;
  }

  // A Notification always have an author.
  // But in case we deleted that user directly from the database
  // below code should fix this.
  // Temporary fix for the deleted user 'anguler.momentum@gmail.com' in current db
  // This is not needed in new database
  if (!notification.author) {
    return null;
  }

  return (
    <Paper ref={ref} className={classes.paper} elevation={2}>
      <A
        to={generatePath(Routes.USER_PROFILE, {
          id: notification.author.id,
        })}
      >
        <LeftSide>
          <Avatar image={notification.author.image} size={34} />

          <Spacing left="xs" />

          <Typography color="textSecondary" variant="subtitle2">
            {notification.author.fullName}
          </Typography>
        </LeftSide>
      </A>

      {notification.follow && (
        <Action>
          <Typography color="textPrimary" variant="subtitle2">
            started following you
          </Typography>
        </Action>
      )}

      {notification.like && (
        <Action>
          <Typography color="textPrimary" variant="subtitle2">
            likes your photo
          </Typography>

          <A
            to={
              notification.like.post.pdf
                ? '#'
                : generatePath(Routes.POST, { id: notification.like.post.id, type: 'image' })
            }
          >
            <PostImage>
              <Image src={notification.like.post.thumbnail || DEFAULT_THUMBNAIL} />
            </PostImage>
          </A>
        </Action>
      )}

      {notification.comment && (
        <Action>
          <Typography color="textPrimary" variant="subtitle2">
            commented on your photo
          </Typography>

          <A
            to={
              notification.comment.post.pdf
                ? '#'
                : generatePath(Routes.POST, { id: notification.comment.post.id, type: 'image' })
            }
          >
            <PostImage>
              <Image src={notification.comment.post.thumbnail || DEFAULT_THUMBNAIL} />
            </PostImage>
          </A>
        </Action>
      )}
    </Paper>
  );
};

Notification.propTypes = {
  close: PropTypes.func,
};

export default Notification;

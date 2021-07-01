import React from 'react';
import PropTypes from 'prop-types';
import { Link, generatePath } from 'react-router-dom';
import { useSubscription } from '@apollo/client';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

import { IS_USER_ONLINE_SUBSCRIPTION } from 'graphql/user';

import Head from 'components/Head';
import Follow from 'components/Follow';
import ProfileImageUpload from './ProfileImageUpload';
import ProfileCoverUpload from './ProfileCoverUpload';

import StudentInfo from './StudentInfo';

import { useStore } from 'store';

import * as Routes from 'routes';

const useStyles = makeStyles((theme) => ({
  info: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: theme.spacing(1),
  },
  nameInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(1),
    '& > *': {
      marginLeft: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  fullName: {
    fontSize: theme.spacing(4),
  },
  online: {
    width: 8,
    height: 8,
    backgroundColor: theme.palette.success,
    borderRadius: '50%',
  },
  profileImage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: -140,
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: theme.spacing(2),
    background: theme.palette.background.default,
  },
}));

/**
 * Renders user information in profile page
 */
const ProfileInfo = ({ user }) => {
  const [{ auth }] = useStore();
  const classes = useStyles();

  const { data, loading } = useSubscription(IS_USER_ONLINE_SUBSCRIPTION, {
    variables: {
      authUserId: auth.user && auth.user.id,
      userId: user.id,
    },
  });

  let isUserOnline = user.isOnline;
  if (!loading && data) {
    isUserOnline = data.isUserOnline.isOnline;
  }

  return (
    <Paper className={classes.paper} elevation={0}>
      <Head title={user.fullName} desc={`${user.followers.length} followers`} />

      <ProfileCoverUpload userId={user.id} coverImage={user.coverImage} coverImagePublicId={user.coverImagePublicId} />

      <div className={classes.profileImage}>
        <ProfileImageUpload
          userId={user.id}
          image={user.image}
          imagePublicId={user.imagePublicId}
          username={user.username}
        />
      </div>

      <div className={classes.nameInfo}>
        <Typography className={classes.fullName}>{user.fullName}</Typography>

        {auth.user && auth.user.id !== user.id && (
          <>
            {isUserOnline && <div className={classes.online} />}

            <Follow user={user} />

            <IconButton
              size="small"
              color="default"
              component={Link}
              to={generatePath(Routes.MESSAGES, { userId: user.id })}
            >
              <MailIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </div>

      <Divider style={{ width: '90%' }} />

      <div className={classes.info}>
        <Typography variant="caption">
          <b>{user.posts.length} </b> posts
        </Typography>
        <Typography variant="caption">
          <b>{user.followers.length} </b> followers
        </Typography>
        <Typography variant="caption">
          <b>{user.following.length} </b> following
        </Typography>
      </div>

      <Divider style={{ width: '90%' }} />

      <StudentInfo user={user} />
    </Paper>
  );
};

ProfileInfo.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ProfileInfo;

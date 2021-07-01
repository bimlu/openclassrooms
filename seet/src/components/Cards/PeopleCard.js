import React from 'react';
import { generatePath } from 'react-router-dom';
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Skeleton from '@material-ui/lab/Skeleton';

import { A } from 'components/Text';

import * as Routes from 'routes';

const useStyles = makeStyles(({ palette }) => ({
  card: {
    borderRadius: 12,
    textAlign: 'center',
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 8px 0px',
  },
  avatar: {
    width: 60,
    height: 60,
    margin: 'auto',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    marginTop: 8,
    marginBottom: 0,
  },
  subheader: {
    fontSize: 14,
    color: palette.grey[500],
    marginBottom: '0.875em',
  },
  statLabel: {
    fontSize: 12,
    color: palette.grey[500],
    fontWeight: 500,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    margin: 0,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: '1px',
  },
  gutteredBorder: {
    borderRight: `1px solid ${palette.divider}`,
  },
}));

export const ProfileCardDemo = ({ user, loading }) => {
  const styles = useStyles();

  return loading ? (
    <Skeleton variant="rect" className={cx(styles.card)} height={240} />
  ) : (
    <Card className={cx(styles.card)}>
      <CardContent>
        <Avatar className={styles.avatar} src={user.image} />
        <h3 className={styles.heading}>{user.fullName}</h3>
        <A to={generatePath(Routes.USER_PROFILE, { id: user.id })}>
          <span className={styles.subheader}>{`@${user.username}`}</span>
        </A>
      </CardContent>
      <Divider light />
      <Box display={'flex'}>
        <Box p={2} flex={'auto'} className={styles.gutteredBorder}>
          <p className={styles.statLabel}>Followers</p>
          <p className={styles.statValue}>{user.followers.length}</p>
        </Box>
        <Box p={2} flex={'auto'}>
          <p className={styles.statLabel}>Following</p>
          <p className={styles.statValue}>{user.following.length}</p>
        </Box>
      </Box>
    </Card>
  );
};

export default ProfileCardDemo;

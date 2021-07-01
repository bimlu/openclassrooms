import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Skeleton from '@material-ui/lab/Skeleton';

import { Spacing } from 'components/Layout';

import ProfileInfo from './ProfileInfo';
import ProfilePosts from './ProfilePosts';
import NotFound from 'components/NotFound';
import Head from 'components/Head';
import ScrollManager from 'components/ScrollManager';

import { GET_USER } from 'graphql/user';
import theme from 'muiTheme';

import { useStore } from 'store';
import { SET_PEOPLE_ROUTE } from 'store/route';

/**
 * User Profile Page
 */
const Profile = () => {
  const { id } = useParams();
  const [{ auth }, dispatch] = useStore();
  const { pathname, search } = useLocation();

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { userId: id },
  });

  useEffect(() => {
    if (data) {
      !auth.user
        ? dispatch({ type: SET_PEOPLE_ROUTE, payload: pathname })
        : auth.user.id !== id && dispatch({ type: SET_PEOPLE_ROUTE, payload: pathname });
    }
  }, [data]);

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <Skeleton variant="rect" height={220} style={{ marginBottom: theme.spacing(1) }} />
          <Skeleton variant="rect" height={220} />
        </>
      );
    }

    if (error || !data.getUser) return <NotFound />;

    return (
      <>
        <ProfileInfo user={data.getUser} />

        <Spacing top="lg" bottom="lg">
          <ProfilePosts userId={id} />
        </Spacing>
      </>
    );
  };

  return (
    <>
      <Head title="Profile" />

      <ScrollManager scrollKey={`${pathname}${search}`} />

      {renderContent()}
    </>
  );
};

export default Profile;

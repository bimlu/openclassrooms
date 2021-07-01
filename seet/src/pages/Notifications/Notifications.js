import React from 'react';
import { useQuery } from '@apollo/client';
import { Redirect } from 'react-router-dom';

import { Loading } from 'components/Loading';
import Notification from 'components/App/Notification';
import InfiniteScroll from 'components/InfiniteScroll';
import Empty from 'components/Empty';
import Head from 'components/Head';

import { useStore } from 'store';
import * as Routes from 'routes';

import { GET_USER_NOTIFICATION } from 'graphql/notification';

import { NOTIFICATIONS_PAGE_NOTIFICATION_LIMIT } from 'constants/DataLimit';

/**
 * Notifications page
 */
const Notifications = () => {
  const [{ auth }] = useStore();

  if (!auth.user) {
    return <Redirect to={Routes.HOME} />;
  }

  const variables = {
    userId: auth.user.id,
    skip: 0,
    limit: NOTIFICATIONS_PAGE_NOTIFICATION_LIMIT,
  };
  const { data, loading, error, fetchMore, networkStatus } = useQuery(GET_USER_NOTIFICATION, {
    variables,
    notifyOnNetworkStatusChange: true,
  });

  const renderContent = () => {
    if (loading && networkStatus === 1) {
      return Array.from(new Array(parseInt(NOTIFICATIONS_PAGE_NOTIFICATION_LIMIT / 2))).map((_el, i) => (
        <Notification key={i} loading={true} />
      ));
    }

    if (error) return 'Please check your internet connection';

    const { notifications, count } = data.getUserNotifications;
    if (!notifications.length) {
      return <Empty text="No notifications yet." />;
    }

    return (
      <InfiniteScroll
        data={notifications}
        dataKey="getUserNotifications.notifications"
        count={parseInt(count)}
        variables={variables}
        fetchMore={fetchMore}
      >
        {(data) => {
          const showNextLoading = loading && networkStatus === 3 && count !== data.length;

          return (
            <>
              {data.map((notification) => (
                <Notification key={notification.id} notification={notification} close={() => false} />
              ))}

              {showNextLoading && <Loading top="lg" />}
            </>
          );
        }}
      </InfiniteScroll>
    );
  };

  return (
    <>
      <Head title="Notifications" />

      {renderContent()}
    </>
  );
};

export default Notifications;

import React, { Fragment, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

import { Loading } from 'components/Loading';
import Empty from 'components/Empty';
import InfiniteScroll from 'components/InfiniteScroll';
import Head from 'components/Head';
import PeopleCard from 'components/Cards/PeopleCard';
import ScrollManager from 'components/ScrollManager';

import { GET_USERS } from 'graphql/user';

import { PEOPLE_PAGE_USERS_LIMIT } from 'constants/DataLimit';

import { useStore } from 'store';
import { SET_PEOPLE_ROUTE } from 'store/route';

import { useQuery } from '@apollo/client';

const PeopleContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 3fr));
  grid-auto-rows: auto;
  grid-gap: 20px;
  margin-bottom: ${(p) => p.theme.spacing.lg};
`;

/**
 * People page
 */
const People = () => {
  const [{ auth }, dispatch] = useStore();
  const { pathname, search, hash } = useLocation();

  const variables = {
    userId: auth.user && auth.user.id,
    skip: 0,
    limit: PEOPLE_PAGE_USERS_LIMIT,
  };
  const { data, loading, error, fetchMore, networkStatus } = useQuery(GET_USERS, {
    variables,
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    dispatch({ type: SET_PEOPLE_ROUTE, payload: pathname + search + hash });
  }, []);

  const renderContent = () => {
    if (loading && networkStatus === 1) {
      return (
        <PeopleContainer>
          {Array.from(new Array(parseInt(PEOPLE_PAGE_USERS_LIMIT / 2))).map((_el, i) => (
            <PeopleCard key={i} loading={true} />
          ))}
        </PeopleContainer>
      );
    }

    if (error) return 'Please check your internet connection';

    const { users, count } = data.getUsers;
    if (!users.length > 0) return <Empty text="No people yet." />;

    return (
      <InfiniteScroll
        data={users}
        dataKey="getUsers.users"
        count={parseInt(count)}
        variables={variables}
        fetchMore={fetchMore}
      >
        {(data) => {
          const showNextLoading = loading && networkStatus === 3 && count !== data.length;

          return (
            <Fragment>
              <PeopleContainer>
                {data.map((user) => (
                  <PeopleCard key={user.id} user={user} />
                ))}
              </PeopleContainer>

              {showNextLoading && <Loading top="lg" />}
            </Fragment>
          );
        }}
      </InfiniteScroll>
    );
  };

  return (
    <>
      <Head title="Students" desc="Find new students" />

      <ScrollManager scrollKey={`${pathname}${search}`} />

      {renderContent()}
    </>
  );
};

export default People;

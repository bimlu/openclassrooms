import React, { Fragment, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';

import { GET_COLLEGES } from 'graphql/college';

import CardsContainer from 'components/Cards/CardsContainer';
import InfiniteScroll from 'components/InfiniteScroll';
import Empty from 'components/Empty';
import { Loading } from 'components/Loading';
import Head from 'components/Head';
import SolidCard from 'components/Cards/SolidCard';
import ScrollManager from 'components/ScrollManager';

import CollegeInfo from 'pages/College/CollegeInfo';
import ExploreHeader from 'pages/Explore/ExploreHeader';

import { EXPLORE_PAGE_CARDS_LIMIT } from 'constants/DataLimit';

import { useStore } from 'store';
import { SET_EXPLORE_ROUTE } from 'store/route';
import * as Routes from 'routes';

/**
 * Colleges page
 */
const Colleges = () => {
  const cardColors = ['#203f52', '#4d137f', '#002244', '#004953'];

  const [, dispatch] = useStore();
  const { pathname, search, hash } = useLocation();

  const variables = {
    skip: 0,
    limit: EXPLORE_PAGE_CARDS_LIMIT,
  };
  const { data, loading, error, fetchMore, networkStatus } = useQuery(GET_COLLEGES, {
    variables,
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    dispatch({ type: SET_EXPLORE_ROUTE, payload: pathname + search + hash });
  }, []);

  const renderContent = () => {
    if (loading && networkStatus === 1) {
      return (
        <CardsContainer>
          {Array.from(new Array(parseInt(EXPLORE_PAGE_CARDS_LIMIT / 2))).map((_el, i) => (
            <SolidCard key={i} loading={true} />
          ))}
        </CardsContainer>
      );
    }

    if (error) return 'Please check your internet connection';

    const { colleges, count } = data.getColleges;
    if (!colleges.length > 0) return <Empty text="No colleges yet." />;

    return (
      <InfiniteScroll
        data={colleges}
        dataKey="getColleges.colleges"
        count={parseInt(count)}
        variables={variables}
        fetchMore={fetchMore}
      >
        {(data) => {
          const showNextLoading = loading && networkStatus === 3 && count !== data.length;
          return (
            <Fragment>
              <CardsContainer>
                {data.map((college, i) => (
                  <SolidCard
                    key={college.id}
                    title={college.name}
                    subtitle={college.fullName}
                    image={college.image}
                    color={cardColors[i % cardColors.length]}
                    url={`${Routes.PROGRAMMES}?collegeId=${college.id}&collegeName=${college.name}`}
                    studentData={`Students: ${college.studentsCount}`}
                    otherData={`Programmes: ${college.programmesCount}`}
                  />
                ))}
              </CardsContainer>

              {showNextLoading && <Loading top="lg" />}
            </Fragment>
          );
        }}
      </InfiniteScroll>
    );
  };

  return (
    <>
      <Head title="Colleges" desc="All available colleges" />

      <ScrollManager scrollKey={`${pathname}${search}`} />

      <ExploreHeader />

      <CollegeInfo />

      {renderContent()}
    </>
  );
};

export default Colleges;

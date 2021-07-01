import React, { Fragment, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';

import { GET_COLLEGE_PROGRAMMES } from 'graphql/programme';

import ProgrammeInfo from 'pages/Programme/ProgrammeInfo';
import ExploreHeader from 'pages/Explore/ExploreHeader';

import CardsContainer from 'components/Cards/CardsContainer';
import InfiniteScroll from 'components/InfiniteScroll';
import Empty from 'components/Empty';
import { Loading } from 'components/Loading';
import Head from 'components/Head';
import SolidCard from 'components/Cards/SolidCard';
import ScrollManager from 'components/ScrollManager';

import { EXPLORE_PAGE_CARDS_LIMIT } from 'constants/DataLimit';

import { useStore } from 'store';
import { SET_EXPLORE_ROUTE } from 'store/route';
import * as Routes from 'routes';

/**
 * Programmes page
 */
const Programmes = () => {
  const cardColors = ['#203f52', '#4d137f', '#002244', '#004953'];

  const [, dispatch] = useStore();
  const { pathname, search, hash } = useLocation();

  const query = new URLSearchParams(search);
  const collegeId = query.get('collegeId');
  const collegeName = query.get('collegeName');

  const variables = {
    collegeId: collegeId,
    skip: 0,
    limit: EXPLORE_PAGE_CARDS_LIMIT,
  };
  const { data, loading, error, fetchMore, networkStatus } = useQuery(GET_COLLEGE_PROGRAMMES, {
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

    const { programmes, count } = data.getCollegeProgrammes;
    if (!programmes.length > 0) return <Empty text="No programmes yet." />;

    return (
      <InfiniteScroll
        data={programmes}
        dataKey="getCollegeProgrammes.programmes"
        count={parseInt(count)}
        variables={variables}
        fetchMore={fetchMore}
      >
        {(data) => {
          const showNextLoading = loading && networkStatus === 3 && count !== data.length;
          return (
            <Fragment>
              <CardsContainer>
                {data.map((programme, i) => (
                  <SolidCard
                    key={programme.id}
                    title={programme.name}
                    subtitle={programme.fullName}
                    image={programme.image}
                    color={cardColors[i % cardColors.length]}
                    url={`${Routes.COURSES}?collegeId=${collegeId}&collegeName=${collegeName}&programmeId=${programme.id}&programmeName=${programme.name}&termType=${programme.termType}&termsCount=${programme.termsCount}#term=all`}
                    studentData={`Students: ${programme.studentsCount}`}
                    otherData={`Courses: ${programme.coursesCount}`}
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
      <Head title={`${collegeName.toUpperCase()}`} />

      <ScrollManager scrollKey={`${pathname}${search}`} />

      <ExploreHeader />

      <ProgrammeInfo collegeId={collegeId} />

      {renderContent()}
    </>
  );
};

export default Programmes;

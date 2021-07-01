import React, { Fragment, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';

import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';

import { GET_COLLEGE_PROGRAMME_COURSES } from 'graphql/course';

import CourseInfo from 'pages/Course/CourseInfo';
import ExploreHeader from 'pages/Explore/ExploreHeader';
import CourseFilter from './CourseFilter';
import SolidCard from './Card';

import CardsContainer from 'components/Cards/CardsContainer';
import InfiniteScroll from 'components/InfiniteScroll';
import Empty from 'components/Empty';
import { Loading } from 'components/Loading';
import Head from 'components/Head';
import ScrollManager from 'components/ScrollManager';

import { EXPLORE_PAGE_CARDS_LIMIT } from 'constants/DataLimit';

import { useStore } from 'store';
import { SET_EXPLORE_ROUTE } from 'store/route';
import * as Routes from 'routes';

/**
 * Courses page
 */
const Courses = () => {
  const cardColors = ['#203f52', '#4d137f', '#002244', '#004953'];

  const [, dispatch] = useStore();
  const { pathname, search, hash } = useLocation();

  const query = new URLSearchParams(search);
  const collegeId = query.get('collegeId');
  const collegeName = query.get('collegeName');
  const programmeId = query.get('programmeId');
  const programmeName = query.get('programmeName');
  const termType = parseInt(query.get('termType'));
  const termsCount = parseInt(query.get('termsCount'));

  const [term, setTerm] = useState('all');

  const variables = {
    collegeId: collegeId,
    programmeId: programmeId,
    skip: 0,
    limit: EXPLORE_PAGE_CARDS_LIMIT,
  };
  const { data, loading, error, fetchMore, networkStatus } = useQuery(GET_COLLEGE_PROGRAMME_COURSES, {
    variables,
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    hash && setTerm(hash.slice(6)); // slice '#term=1'
    dispatch({ type: SET_EXPLORE_ROUTE, payload: pathname + search + hash });
  }, [hash]);

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

    const { courses, count } = data.getCollegeProgrammeCourses;
    if (!courses.length > 0) return <Empty text="No courses yet." />;

    return (
      <InfiniteScroll
        data={courses}
        dataKey="getCollegeProgrammeCourses.courses"
        count={parseInt(count)}
        variables={variables}
        fetchMore={fetchMore}
      >
        {(data) => {
          const showNextLoading = loading && networkStatus === 3 && count !== data.length;

          return (
            <Fragment>
              <CardsContainer>
                {data
                  // show all course if term === 'all', filter otherwise
                  .filter((course) => term === 'all' || course.term === parseInt(term))
                  .map((course, i) => (
                    <SolidCard
                      key={course.id}
                      title={course.name}
                      subtitle={course.fullName}
                      image={course.image}
                      color={cardColors[i % cardColors.length]}
                      url={`${Routes.POSTS}?collegeId=${collegeId}&collegeName=${collegeName}&programmeId=${programmeId}&programmeName=${programmeName}&termType=${termType}&termsCount=${termsCount}&term=${course.term}&courseId=${course.id}&courseName=${course.name}`}
                      studentData={`Students: ${course.studentsCount}`}
                      otherData={`Posts: ${course.postsCount}`}
                      postsCount={course.postsCount}
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
      <Head title={`${programmeName.toUpperCase()} | ${collegeName.toUpperCase()}`} />

      <ScrollManager scrollKey={`${pathname}${search}`} />

      <ExploreHeader />

      <CourseInfo collegeId={collegeId} programmeId={programmeId} />

      <CourseFilter termType={termType} termsCount={termsCount} selectedTerm={term} />

      <Box m={1} mb={2}>
        <Divider />
      </Box>

      {renderContent()}
    </>
  );
};

export default Courses;

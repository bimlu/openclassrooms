import React, { Fragment, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';

import { GET_COLLEGE_PROGRAMME_COURSE_POSTS } from 'graphql/post';

import PostInfo from 'pages/Post/PostInfo';
import ExploreHeader from 'pages/Explore/ExploreHeader';

import PostCard from 'components/PostCard';
import PDFCard from 'components/PostCard/PDFCard';
import InfiniteScroll from 'components/InfiniteScroll';
import Empty from 'components/Empty';
import { Loading } from 'components/Loading';
import Head from 'components/Head';
import ScrollManager from 'components/ScrollManager';

import { EXPLORE_PAGE_POSTS_LIMIT } from 'constants/DataLimit';

import { useStore } from 'store';
import { SET_EXPLORE_ROUTE } from 'store/route';

/**
 * Posts page
 */
const Posts = () => {
  const [, dispatch] = useStore();
  const { pathname, search, hash } = useLocation();

  const query = new URLSearchParams(search);
  const collegeId = query.get('collegeId');
  const collegeName = query.get('collegeName');
  const programmeId = query.get('programmeId');
  const programmeName = query.get('programmeName');
  const courseId = query.get('courseId');
  const courseName = query.get('courseName');

  const variables = {
    collegeId: collegeId,
    programmeId: programmeId,
    courseId: courseId,
    skip: 0,
    limit: EXPLORE_PAGE_POSTS_LIMIT,
  };
  const { data, loading, error, fetchMore, networkStatus } = useQuery(GET_COLLEGE_PROGRAMME_COURSE_POSTS, {
    variables,
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    dispatch({ type: SET_EXPLORE_ROUTE, payload: pathname + search + hash });
  }, []);

  const renderContent = () => {
    if (loading && networkStatus === 1) {
      return Array.from(new Array(parseInt(EXPLORE_PAGE_POSTS_LIMIT / 2))).map((_el, i) => (
        <PostCard key={i} cardDataLoading={true} />
      ));
    }

    if (error) return 'Please check your internet connection';

    const { posts, count } = data.getCollegeProgrammeCoursePosts;
    if (!posts.length > 0) return <Empty text="No posts yet." />;

    return (
      <InfiniteScroll
        data={posts}
        dataKey="getCollegeProgrammeCoursePosts.posts"
        count={parseInt(count)}
        variables={variables}
        fetchMore={fetchMore}
      >
        {(data) => {
          return (
            <>
              {data.map((post, i) => {
                const showNextLoading = loading && networkStatus === 3 && data.length - 1 === i;

                return (
                  <Fragment key={post.id}>
                    {post.pdf ? (
                      <PDFCard
                        author={post.author}
                        postId={post.id}
                        pdfPublicId={post.pdfPublicId}
                        imagePublicIds={post.imagePublicIds}
                        thumbnail={post.thumbnail}
                        pdf={post.pdf}
                        comments={post.comments}
                        title={post.title}
                        likes={post.likes}
                        viewsCount={post.viewsCount}
                        downloadsCount={post.downloadsCount}
                        createdAt={post.createdAt}
                      />
                    ) : (
                      <PostCard
                        author={post.author}
                        postId={post.id}
                        pdfPublicId={post.pdfPublicId}
                        imagePublicIds={post.imagePublicIds}
                        thumbnail={post.thumbnail}
                        pdf={post.pdf}
                        comments={post.comments}
                        title={post.title}
                        likes={post.likes}
                        viewsCount={post.viewsCount}
                        downloadsCount={post.downloadsCount}
                        createdAt={post.createdAt}
                      />
                    )}

                    {showNextLoading && <Loading top="lg" />}
                  </Fragment>
                );
              })}
            </>
          );
        }}
      </InfiniteScroll>
    );
  };

  return (
    <>
      <Head title={`${courseName.toUpperCase()} | ${programmeName.toUpperCase()} | ${collegeName.toUpperCase()}`} />

      <ScrollManager scrollKey={`${pathname}${search}`} />

      <ExploreHeader />

      <PostInfo collegeId={collegeId} programmeId={programmeId} courseId={courseId} courseName={courseName} />

      {renderContent()}
    </>
  );
};

export default Posts;

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';

import PostCard from 'components/PostCard';
import PDFCard from 'components/PostCard/PDFCard';
import { Spacing } from 'components/Layout';
import InfiniteScroll from 'components/InfiniteScroll';
import { Loading } from 'components/Loading';
import Empty from 'components/Empty';

import { PROFILE_PAGE_POSTS_LIMIT } from 'constants/DataLimit';

import { GET_USER_POSTS } from 'graphql/user';

/**
 * Renders posts in profile page
 */
const ProfilePosts = ({ userId }) => {
  const variables = { userId, skip: 0, limit: PROFILE_PAGE_POSTS_LIMIT };
  const { data, loading, fetchMore, networkStatus } = useQuery(GET_USER_POSTS, {
    variables,
    notifyOnNetworkStatusChange: true,
  });

  if (loading && networkStatus === 1) {
    return Array.from(new Array(parseInt(PROFILE_PAGE_POSTS_LIMIT / 2))).map((_el, i) => (
      <PostCard key={i} cardDataLoading={true} />
    ));
  }

  const { posts, count } = data.getUserPosts;
  if (!posts.length > 0) {
    return (
      <Spacing bottom="lg">
        <Empty text="No posts yet." />
      </Spacing>
    );
  }

  return (
    <InfiniteScroll
      data={posts}
      dataKey="getUserPosts.posts"
      count={parseInt(count)}
      variables={variables}
      fetchMore={fetchMore}
    >
      {(data) => {
        return data.map((post, i) => {
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
        });
      }}
    </InfiniteScroll>
  );
};

ProfilePosts.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default ProfilePosts;

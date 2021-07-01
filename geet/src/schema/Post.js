import { gql } from 'apollo-server-express';

/**
 * Post schema
 */
const PostSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type Post {
    id: ID!
    title: String
    pdf: File
    pdfPublicId: String
    images: [File]
    imagePublicIds: [String]
    thumbnail: String
    author: User!
    likes: [Like]
    likesCount: Int
    viewsCount: Int
    downloadsCount: Int
    comments: [Comment]
    college: College
    programme: Programme
    course: Course
    createdAt: String
    updatedAt: String
  }

  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreatePostInput {
    title: String
    pdf: Upload
    images: [Upload]
    authorId: ID!
    collegeId: ID
    programmeId: ID
    courseId: ID
    fileName: String
  }

  input DeletePostInput {
    id: ID!
    pdfPublicId: String
    imagePublicIds: [String]
  }

  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------

  type PostPayload {
    id: ID!
    title: String
    pdf: String
    pdfPublicId: String
    images: [String]
    imagePublicIds: [String]
    thumbnail: String
    author: UserPayload
    likes: [Like]
    likesCount: Int
    viewsCount: Int
    downloadsCount: Int
    comments: [CommentPayload]
    college: CollegePayload
    programme: ProgrammePayload
    course: CoursePayload
    createdAt: String
    updatedAt: String
  }

  type PostsPayload {
    posts: [PostPayload]!
    count: String!
  }

  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    # Gets posts from followed users
    getFollowedPosts(userId: String!, skip: Int, limit: Int): PostsPayload

    # Gets all posts
    getPosts(authUserId: ID!, skip: Int, limit: Int): PostsPayload

    # Gets post by id
    getPost(id: ID!): PostPayload

    # Gets posts of a specific course, programme and college
    getCollegeProgrammeCoursePosts(collegeId: ID, programmeId: ID, courseId: ID, skip: Int, limit: Int): PostsPayload
  }

  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a new post
    createPost(input: CreatePostInput!): PostPayload

    # Deletes a user post
    deletePost(input: DeletePostInput!): PostPayload

    # Increment view count by 1
    incrementViewsCount(postId: ID!): PostPayload

    # Increment download count by 1
    incrementDownloadsCount(postId: ID!): PostPayload
  }
`;

export default PostSchema;

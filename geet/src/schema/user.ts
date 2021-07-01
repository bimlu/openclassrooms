import { gql } from 'apollo-server-express';

/**
 * User schema
 */
const UserSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  enum Role {
    User
    Moderator
    Admin
    SuperAdmin
  }

  type User {
    role: Role!
    id: ID!
    fullName: String!
    email: String!
    username: String!
    facebookId: String
    googleId: String
    githubId: String
    twitterId: String
    image: File
    imagePublicId: String
    about: String
    website: String
    coverImage: File
    coverImagePublicId: String
    isOnline: Boolean
    posts: [PostPayload]
    likes: [Like]
    comments: [Comment]
    followers: [Follow]
    following: [Follow]
    notifications: [NotificationPayload]
    college: College
    programme: Programme
    courses: [Course]
    createdAt: String
    updatedAt: String
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type SuccessMessage {
    message: String!
  }

  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input UploadUserPhotoInput {
    id: ID!
    image: Upload!
    imagePublicId: String
    isCover: Boolean
  }

  input UpdateUserCollegeInput {
    id: ID!
    collegeId: ID
  }

  input UpdateUserProgrammeInput {
    id: ID!
    programmeId: ID
  }

  input AddUserCourseInput {
    id: ID!
    courseId: ID!
  }

  input RemoveUserCourseInput {
    id: ID!
    courseId: ID
  }

  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type UserPayload {
    role: Int
    id: ID
    fullName: String
    email: String
    username: String
    facebookId: String
    googleId: String
    githubId: String
    twitterId: String
    password: String
    image: String
    imagePublicId: String
    about: String
    website: String
    coverImage: String
    coverImagePublicId: String
    isOnline: Boolean
    posts: [PostPayload]
    likes: [Like]
    followers: [Follow]
    following: [Follow]
    notifications: [NotificationPayload]
    newNotifications: [NotificationPayload]
    newConversations: [ConversationsPayload]
    unseenMessage: Boolean
    college: College
    programme: Programme
    courses: [Course]
    createdAt: String
    updatedAt: String
  }

  type UsersPayload {
    users: [UserPayload]!
    count: String
  }

  type UserPostsPayload {
    posts: [PostPayload]
    count: String
  }

  type IsUserOnlinePayload {
    userId: ID!
    isOnline: Boolean
  }

  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    # Gets the currently logged in user
    getAuthUser: UserPayload

    # Gets user by username or by id
    getUser(userId: ID): UserPayload

    # Gets all users
    getUsers(userId: String, skip: Int, limit: Int): UsersPayload

    # Gets user's posts
    getUserPosts(userId: ID, skip: Int, limit: Int): UserPostsPayload

    # Searches users by username or fullName
    searchUsers(searchQuery: String!): [UserPayload]

    # Gets Suggested people for user
    suggestPeople(userId: String!): [UserPayload]
  }

  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Uploads user Profile or Cover photo
    uploadUserPhoto(input: UploadUserPhotoInput!): UserPayload

    # Updates college of user
    updateUserCollege(input: UpdateUserCollegeInput!): UserPayload

    # Updates programme of user
    updateUserProgramme(input: UpdateUserProgrammeInput!): UserPayload

    # Adds a course to user
    addUserCourse(input: AddUserCourseInput!): UserPayload

    # Removes a course if courseId is provided, otherwises removes all courses from user
    removeUserCourse(input: RemoveUserCourseInput!): UserPayload
  }

  # ---------------------------------------------------------
  # Subscriptions
  # ---------------------------------------------------------
  extend type Subscription {
    # Subscribes to is user online event
    isUserOnline(authUserId: ID, userId: ID!): IsUserOnlinePayload
  }
`;

export default UserSchema;

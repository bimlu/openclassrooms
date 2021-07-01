import { gql } from '@apollo/client';
import { postCommentsPayload, postAuthorPayload, postLikesPayload } from './post';

/**
 * Records to select from user
 */
const userPayload = `
  id
  username
  email
  fullName
  image
  role
  imagePublicId
  coverImage
  coverImagePublicId
  createdAt
`;

/**
 * Gets specific user by userId
 */
export const GET_USER = gql`
  query($userId: ID) {
    getUser(userId: $userId) {
      ${userPayload}
      isOnline
      posts {
        id
      }
      following {
        id
      }
      followers {
        id
      }
      notifications {
        id
        author {
          id
          username
        }
        follow {
          id
        }
        like {
          id
        }
        comment {
          id
        }
      }
      college {
        id
        name
      }
      programme {
        id
        name
      }
      courses {
        id
        name
      }
    }
  }
`;

/**
 * Gets user posts
 */
export const GET_USER_POSTS = gql`
  query($userId: ID!, $skip: Int, $limit: Int) {
    getUserPosts(userId: $userId, skip: $skip, limit: $limit) {
      count
      posts {
        id
        title
        pdfPublicId
        imagePublicIds
        thumbnail
        pdf
        viewsCount
        downloadsCount
        createdAt
        ${postAuthorPayload}
        ${postCommentsPayload}
        ${postLikesPayload}
      }
    }
  }
`;

/**
 * Gets authenticated user
 */
export const GET_AUTH_USER = gql`
  query {
    getAuthUser {
      ${userPayload}
      newNotifications {
        id
        createdAt
        author {
          id
          fullName
          username
          image
        }
        follow {
          id
        }
        comment {
          id
          post {
            id
            thumbnail
          }
        }
        like {
          id
          post {
            id
            thumbnail
          }
        }
      }
      newConversations {
        id
        username
        fullName
        image
        lastMessage
        lastMessageCreatedAt
      }
      likes {
        id
        user
        post
      }
      posts {
        id
      }
      following {
        id
        user
      }
      followers {
        id
      }
      college {
        id
        name
      }
      programme {
        id
        name
      }
      courses {
        id
        name
      }
    }
  }
`;

/**
 * Gets all available users
 */
export const GET_USERS = gql`
  query($userId: String, $skip: Int, $limit: Int) {
    getUsers(userId: $userId, skip: $skip, limit: $limit) {
      count
      users {
        id
        fullName
        username
        image
        following {
          id
          user
        }
        followers {
          id
        }
        notifications {
          id
          author {
            id
            username
          }
          follow {
            id
          }
        }
      }
    }
  }
`;

/**
 * Searches users by username or fullName
 */
export const SEARCH_USERS = gql`
  query($searchQuery: String!) {
    searchUsers(searchQuery: $searchQuery) {
      id
      fullName
      username
      image
    }
  }
`;

/**
 * Uploads user photo
 */
export const UPLOAD_PHOTO = gql`
  mutation($input: UploadUserPhotoInput!) {
    uploadUserPhoto(input: $input) {
      id
    }
  }
`;

/**
 * Updates college of user
 */
export const UPDATE_USER_COLLEGE = gql`
  mutation($input: UpdateUserCollegeInput!) {
    updateUserCollege(input: $input) {
      id
    }
  }
`;

/**
 * Updates programme of user
 */
export const UPDATE_USER_PROGRAMME = gql`
  mutation($input: UpdateUserProgrammeInput!) {
    updateUserProgramme(input: $input) {
      id
    }
  }
`;

/**
 * Adds a course to user
 */
export const ADD_USER_COURSE = gql`
  mutation($input: AddUserCourseInput!) {
    addUserCourse(input: $input) {
      id
    }
  }
`;

/**
 * Removes a course to user
 */
export const REMOVE_USER_COURSE = gql`
  mutation($input: RemoveUserCourseInput!) {
    removeUserCourse(input: $input) {
      id
    }
  }
`;

/**
 * People suggestions for auth user
 */
export const USER_SUGGESTIONS = gql`
  query($userId: String!) {
    suggestPeople(userId: $userId) {
      id
      fullName
      username
      image
    }
  }
`;

/**
 * Get users with whom authUser had a conversation
 */
export const GET_CONVERSATIONS = gql`
  query($authUserId: ID!) {
    getConversations(authUserId: $authUserId) {
      id
      username
      fullName
      image
      isOnline
      seen
      lastMessage
      lastMessageSender
      lastMessageCreatedAt
    }
  }
`;

/**
 * Checks if user is online in real time
 */
export const IS_USER_ONLINE_SUBSCRIPTION = gql`
  subscription($authUserId: ID, $userId: ID!) {
    isUserOnline(authUserId: $authUserId, userId: $userId) {
      userId
      isOnline
    }
  }
`;

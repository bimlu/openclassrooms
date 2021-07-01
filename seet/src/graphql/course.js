import { gql } from '@apollo/client';

/**
 * Gets specific course by id
 */
export const GET_COURSE = gql`
  query($id: ID, $name: String) {
    getCourse(id: $id, name: $name) {
      id
      name
      fullName
      term
      verified
      createdBy {
        id
        username
        fullName
      }
      description
      image
      imagePublicId
      createdAt
      college {
        id
        name
      }
      programme {
        id
        name
      }
      students {
        id
      }
      posts {
        id
      }
    }
  }
`;

/**
 * Gets courses for specific programme and college
 */
export const GET_COLLEGE_PROGRAMME_COURSES = gql`
  query($collegeId: ID!, $programmeId: ID!, $skip: Int, $limit: Int) {
    getCollegeProgrammeCourses(collegeId: $collegeId, programmeId: $programmeId, skip: $skip, limit: $limit) {
      count
      courses {
        id
        name
        fullName
        term
        description
        verified
        image
        studentsCount
        postsCount
      }
    }
  }
`;

/**
 * Gets all available courses
 */
export const GET_COURSES = gql`
  query($skip: Int, $limit: Int) {
    getCourses(skip: $skip, limit: $limit) {
      count
      courses {
        id
        name
        fullName
        term
        verified
      }
    }
  }
`;

/**
 * Creates a course
 */
export const CREATE_COURSE = gql`
  mutation($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
    }
  }
`;

/**
 * Updates a course
 */
export const UPDATE_COURSE = gql`
  mutation($input: UpdateCourseInput!) {
    updateCourse(input: $input) {
      id
    }
  }
`;

/**
 * Deletes a course
 */
export const DELETE_COURSE = gql`
  mutation($input: DeleteCourseInput!) {
    deleteCourse(input: $input) {
      id
    }
  }
`;

/**
 * Toggles Verification of a course
 */
export const TOGGLE_COURSE_VERIFICATION = gql`
  mutation($id: ID!) {
    toggleCourseVerification(id: $id) {
      id
    }
  }
`;

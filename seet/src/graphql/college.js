import { gql } from '@apollo/client';

/**
 * Gets specific college by id
 */
export const GET_COLLEGE = gql`
  query($id: ID, $name: String) {
    getCollege(id: $id, name: $name) {
      id
      name
      fullName
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
      students {
        id
      }
      programmes {
        id
      }
    }
  }
`;

/**
 * Gets all available colleges
 */
export const GET_COLLEGES = gql`
  query($skip: Int, $limit: Int) {
    getColleges(skip: $skip, limit: $limit) {
      count
      colleges {
        id
        name
        fullName
        image
        description
        verified
        studentsCount
        programmesCount
      }
    }
  }
`;

/**
 * Gets all avilable colleges with programmes populated
 */
export const GET_COLLEGES_WITH_PROGRAMMES = gql`
  query($skip: Int, $limit: Int) {
    getColleges(skip: $skip, limit: $limit) {
      count
      colleges {
        id
        name
        verified
        programmes {
          id
          name
        }
      }
    }
  }
`;

/**
 * Gets all avilable colleges with programmes and courses populated
 */
export const GET_COLLEGES_WITH_PROGRAMMES_COURSES = gql`
  query($skip: Int, $limit: Int) {
    getColleges(skip: $skip, limit: $limit) {
      count
      colleges {
        id
        name
        fullName
        verified
        programmes {
          id
          name
          fullName
          degree
          termType
          termsCount
          courses {
            id
            name
            fullName
            term
          }
        }
      }
    }
  }
`;

/**
 * Creates a college
 */
export const CREATE_COLLEGE = gql`
  mutation($input: CreateCollegeInput!) {
    createCollege(input: $input) {
      id
    }
  }
`;

/**
 * Updates a college
 */
export const UPDATE_COLLEGE = gql`
  mutation($input: UpdateCollegeInput!) {
    updateCollege(input: $input) {
      id
    }
  }
`;

/**
 * Deletes a college
 */
export const DELETE_COLLEGE = gql`
  mutation($input: DeleteCollegeInput!) {
    deleteCollege(input: $input) {
      id
    }
  }
`;

/**
 * Toggles Verification of a college
 */
export const TOGGLE_COLLEGE_VERIFICATION = gql`
  mutation($id: ID!) {
    toggleCollegeVerification(id: $id) {
      id
    }
  }
`;

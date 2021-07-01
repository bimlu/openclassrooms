import { gql } from '@apollo/client';

/**
 * Gets specific programme by id
 */
export const GET_PROGRAMME = gql`
  query($id: ID, $name: String) {
    getProgramme(id: $id, name: $name) {
      id
      name
      fullName
      degree
      termType
      termsCount
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
      students {
        id
      }
      courses {
        id
      }
    }
  }
`;

/**
 * Gets programmes for a specific college
 */
export const GET_COLLEGE_PROGRAMMES = gql`
  query($collegeId: ID!, $skip: Int, $limit: Int) {
    getCollegeProgrammes(collegeId: $collegeId, skip: $skip, limit: $limit) {
      count
      programmes {
        id
        name
        fullName
        degree
        termType
        termsCount
        description
        verified
        image
        studentsCount
        coursesCount
      }
    }
  }
`;

/**
 * Gets all available programmes
 */
export const GET_PROGRAMMES = gql`
  query($skip: Int, $limit: Int) {
    getProgrammes(skip: $skip, limit: $limit) {
      count
      programmes {
        id
        name
        fullName
        degree
        termType
        termsCount
        verified
      }
    }
  }
`;

/**
 * Creates a programme
 */
export const CREATE_PROGRAMME = gql`
  mutation($input: CreateProgrammeInput!) {
    createProgramme(input: $input) {
      id
    }
  }
`;

/**
 * Update a programme
 */
export const UPDATE_PROGRAMME = gql`
  mutation($input: UpdateProgrammeInput!) {
    updateProgramme(input: $input) {
      id
    }
  }
`;

/**
 * Deletes a programme
 */
export const DELETE_PROGRAMME = gql`
  mutation($input: DeleteProgrammeInput!) {
    deleteProgramme(input: $input) {
      id
    }
  }
`;

/**
 * Toggles Verification of a programme
 */
export const TOGGLE_PROGRAMME_VERIFICATION = gql`
  mutation($id: ID!) {
    toggleProgrammeVerification(id: $id) {
      id
    }
  }
`;

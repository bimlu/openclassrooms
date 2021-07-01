import { gql } from 'apollo-server-express';

/**
 * Programme schema
 */
const ProgrammeSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------

  type Programme {
    degree: Int
    termType: Int
    termsCount: Int
    id: ID!
    name: String!
    fullName: String!
    createdBy: User!
    description: String
    image: File
    imagePublicId: String
    verified: Boolean
    college: College!
    courses: [Course]
    coursesCount: Int
    students: [User]
    studentsCount: Int
    createdAt: String
    updatedAt: String
  }

  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateProgrammeInput {
    degree: Int
    termType: Int
    termsCount: Int
    name: String!
    fullName: String!
    createdBy: ID!
    description: String
    image: Upload
    imagePublicId: String
    collegeId: ID!
  }

  input DeleteProgrammeInput {
    id: ID!
    imagePublicId: String
  }

  input UpdateProgrammeInput {
    degree: Int
    termType: Int
    termsCount: Int
    id: ID!
    updatedBy: ID!
    name: String
    fullName: String
    description: String
    image: Upload
    imagePublicId: String
  }

  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type ProgrammePayload {
    degree: Int
    termType: Int
    termsCount: Int
    id: ID!
    name: String
    fullName: String
    createdBy: User
    description: String
    image: String
    imagePublicId: String
    verified: Boolean
    college: College
    courses: [Course]
    coursesCount: Int
    students: [User]
    studentsCount: Int
    createdAt: String
    updatedAt: String
  }

  type ProgrammesPayload {
    programmes: [ProgrammePayload]!
    count: String!
  }

  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    # Gets programme by id or name
    getProgramme(id: ID, name: String): ProgrammePayload

    # Gets all programmes
    getProgrammes(skip: Int, limit: Int): ProgrammesPayload

    # Gets programmes of a College
    getCollegeProgrammes(collegeId: ID!, skip: Int, limit: Int): ProgrammesPayload
  }

  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a Programme
    createProgramme(input: CreateProgrammeInput!): ProgrammePayload

    # Deletes a Programme
    deleteProgramme(input: DeleteProgrammeInput!): ProgrammePayload

    # Updates a College
    updateProgramme(input: UpdateProgrammeInput!): ProgrammePayload

    # Toggles verification of a Programme
    toggleProgrammeVerification(id: ID!): ProgrammePayload
  }
`;

export default ProgrammeSchema;

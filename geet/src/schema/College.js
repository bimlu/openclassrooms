import { gql } from 'apollo-server-express';

/**
 * College schema
 */
const CollegeSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type College {
    id: ID!
    name: String!
    fullName: String!
    createdBy: User!
    description: String
    image: File
    imagePublicId: String
    verified: Boolean
    programmes: [Programme]
    programmesCount: Int
    students: [User]
    studentsCount: Int
    createdAt: String
    updatedAt: String
  }

  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateCollegeInput {
    name: String!
    fullName: String!
    createdBy: ID!
    description: String
    image: Upload
    imagePublicId: String
  }

  input DeleteCollegeInput {
    id: ID!
    imagePublicId: String
  }

  input UpdateCollegeInput {
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
  type CollegePayload {
    id: ID!
    name: String
    fullName: String
    createdBy: User
    description: String
    image: String
    imagePublicId: String
    verified: Boolean
    programmes: [Programme]
    programmesCount: Int
    students: [User]
    studentsCount: Int
    createdAt: String
    updatedAt: String
  }

  type CollegesPayload {
    colleges: [CollegePayload]!
    count: String!
  }

  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    # Gets college by id or name
    getCollege(id: ID, name: String): CollegePayload

    # Gets all colleges
    getColleges(skip: Int, limit: Int): CollegesPayload
  }

  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a College
    createCollege(input: CreateCollegeInput!): CollegePayload

    # Deletes a College
    deleteCollege(input: DeleteCollegeInput!): CollegePayload

    # Updates a College
    updateCollege(input: UpdateCollegeInput!): CollegePayload

    # Toggles verification of a College
    toggleCollegeVerification(id: ID!): CollegePayload
  }
`;

export default CollegeSchema;

import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: Int
    email: String
    name: String
    description: String
    profile_picture: Picture
    friends: [User]
  }

  type Picture {
    id: Int
    source: String
    author: User
  }

  type Post {
    id: Int
    picture: Picture
    author: User
    likes: [User]
    comments: [Comment]
    title: String
  }

  type Comment {
    id: Int
    body: String
    post: Post
    author: User
  }

  type Query {
    # User
    user(id: Int!): User
    userFriends(userId: Int!): [User]

    # Picture
    picture(id: Int!): Picture

    # Post
    post(id: Int!): Post
    posts: [Post]
    postsByUser(userId: Int!): [Post]

    # Comment
    comment(id: Int!): Comment
    commentsByPost(postId: Int!): [Comment]
  }

  type Mutation {
    # User
    addUser(input: AddUserInput): AddUserResponse
    updateUser(input: UpdateUserInput): UpdateUserResponse
    deleteUser(input: DeleteUserInput): DeleteUserResponse
  }

  # Interfaces
  interface MutationResponse {
    success: Boolean!
    message: String!
  }

  # Inputs
  input AddUserInput {
    email: String!
    password: String!
    name: String!
  }

  input UpdateUserInput {
    id: Int!
    email: String
    password: String
    name: String
    description: String
    profile_picture_id: Int
  }

  input DeleteUserInput {
    id: Int!
  }

  type AddUserResponse implements MutationResponse {
    success: Boolean!
    message: String!
    data: User
  }

  type UpdateUserResponse implements MutationResponse {
    success: Boolean!
    message: String!
    data: User
  }

  type DeleteUserResponse implements MutationResponse {
    success: Boolean!
    message: String!
  }
`;

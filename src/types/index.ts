import { gql } from 'apollo-server';

export const typeDefs = gql`
  type File {
    name: String!
    type: String!
    uri: String!
  }

  type User {
    id: Int
    email: String!
    name: String
    media: Media
  }

  type Media {
    id: Int
    source: String!
    user: User!
  }

  type Post {
    id: Int
    title: String
    user: User!
    medias: [Media]!
    comments: [Comment]
  }

  type Comment {
    id: Int
    body: String!
    user: User!
  }

  type Query {
    # user
    me: User
    user(id: Int!): User

    # media
    media(id: Int!): Media

    # post
    post(id: Int!): Post
    posts: [Post]
    postsByUser(userId: Int!): [Post]

    # comment
    commentsByPost(postId: Int!): [Comment]
  }

  type Mutation {
    # user
    createUser(input: CreateUserInput): CrudUserResponse
    updateUser(input: UpdateUserInput): CrudUserResponse

    # post
    createPost(input: CreatePostInput): CrudPostResponse
    deletePost(input: DeleteDefaultInput): DeleteDefaultResponse

    # comment
    createComment(input: CreateCommentInput): CrudCommentResponse
    deleteComment(input: DeleteDefaultInput): DeleteDefaultResponse

    # media
    uploadMedia(file: Upload!): Up
  }

  type Up {
    ok: Boolean
  }

  # Interfaces
  interface MutationResponse {
    success: Boolean!
    message: String!
  }

  # Inputs
  input DeleteDefaultInput {
    id: Int!
  }

  input CreateUserInput {
    email: String!
    name: String!
    password: String!
  }

  input UpdateUserInput {
    id: Int!
    name: String
    mediaSource: String
  }

  input CreatePostInput {
    title: String
    user_id: Int!
    mediasSource: [String]!
  }

  input UpdatePostInput {
    id: Int!
    title: String
    mediasSource: [String]
  }

  input CreateCommentInput {
    body: String
    user_id: Int!
    post_id: Int!
  }

  # Responses
  type DeleteDefaultResponse implements MutationResponse {
    success: Boolean!
    message: String!
  }

  type CrudUserResponse implements MutationResponse {
    success: Boolean!
    message: String!
    data: User!
  }

  type CrudPostResponse implements MutationResponse {
    success: Boolean!
    message: String!
    data: Post!
  }

  type CrudCommentResponse implements MutationResponse {
    success: Boolean!
    message: String!
    data: Comment
  }
`;

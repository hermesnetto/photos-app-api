import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: Int
    email: String
    name: String
    description: String
    profile_picture: Picture
    posts: [Post]
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
    posts: [Post]
    post(id: Int!): Post

    # Comment
    comment(id: Int!): Comment
    commentsByPost(postId: Int): [Comment]
  }
`;

"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_1 = require("apollo-server");
exports.typeDefs = apollo_server_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type User {\n    id: Int\n    email: String!\n    name: String\n    media: Media\n  }\n\n  type Media {\n    id: Int\n    source: String!\n    author: User!\n  }\n\n  type Post {\n    id: Int\n    title: String\n    author: User!\n    medias: [Media]!\n    comments: [Comment]\n  }\n\n  type Comment {\n    id: Int\n    body: String!\n    author: User!\n  }\n\n  type Query {\n    # user\n    user(id: Int!): User\n\n    # media\n    media(id: Int!): Media\n\n    # post\n    post(id: Int!): Post\n    postsByUser(authorId: Int!): [Post]\n\n    # comment\n    commentsByPost(postId: Int!): [Comment]\n  }\n\n  type Mutation {\n    # user\n    createUser(input: CreateUserInput): CrudUserResponse\n    updateUser(input: UpdateUserInput): CrudUserResponse\n\n    # post\n    createPost(input: CreatePostInput): CrudPostResponse\n    deletePost(input: DeleteDefaultInput): DeleteDefaultResponse\n\n    # comment\n    createComment(input: CreateCommentInput): CrudCommentResponse\n    deleteComment(input: DeleteDefaultInput): DeleteDefaultResponse\n  }\n\n  # Interfaces\n  interface MutationResponse {\n    success: Boolean!\n    message: String!\n  }\n\n  # Inputs\n  input DeleteDefaultInput {\n    id: Int!\n  }\n\n  input CreateUserInput {\n    email: String!\n    name: String!\n    password: String!\n  }\n\n  input UpdateUserInput {\n    id: Int!\n    name: String\n    mediaSource: String\n  }\n\n  input CreatePostInput {\n    title: String\n    user_id: Int!\n    mediasSource: [String]!\n  }\n\n  input UpdatePostInput {\n    id: Int!\n    title: String\n    mediasSource: [String]\n  }\n\n  input CreateCommentInput {\n    body: String\n    user_id: Int!\n    post_id: Int!\n  }\n\n  # Responses\n  type DeleteDefaultResponse implements MutationResponse {\n    success: Boolean!\n    message: String!\n  }\n\n  type CrudUserResponse implements MutationResponse {\n    success: Boolean!\n    message: String!\n    data: User!\n  }\n\n  type CrudPostResponse implements MutationResponse {\n    success: Boolean!\n    message: String!\n    data: Post!\n  }\n\n  type CrudCommentResponse implements MutationResponse {\n    success: Boolean!\n    message: String!\n    data: Comment\n  }\n"], ["\n  type User {\n    id: Int\n    email: String!\n    name: String\n    media: Media\n  }\n\n  type Media {\n    id: Int\n    source: String!\n    author: User!\n  }\n\n  type Post {\n    id: Int\n    title: String\n    author: User!\n    medias: [Media]!\n    comments: [Comment]\n  }\n\n  type Comment {\n    id: Int\n    body: String!\n    author: User!\n  }\n\n  type Query {\n    # user\n    user(id: Int!): User\n\n    # media\n    media(id: Int!): Media\n\n    # post\n    post(id: Int!): Post\n    postsByUser(authorId: Int!): [Post]\n\n    # comment\n    commentsByPost(postId: Int!): [Comment]\n  }\n\n  type Mutation {\n    # user\n    createUser(input: CreateUserInput): CrudUserResponse\n    updateUser(input: UpdateUserInput): CrudUserResponse\n\n    # post\n    createPost(input: CreatePostInput): CrudPostResponse\n    deletePost(input: DeleteDefaultInput): DeleteDefaultResponse\n\n    # comment\n    createComment(input: CreateCommentInput): CrudCommentResponse\n    deleteComment(input: DeleteDefaultInput): DeleteDefaultResponse\n  }\n\n  # Interfaces\n  interface MutationResponse {\n    success: Boolean!\n    message: String!\n  }\n\n  # Inputs\n  input DeleteDefaultInput {\n    id: Int!\n  }\n\n  input CreateUserInput {\n    email: String!\n    name: String!\n    password: String!\n  }\n\n  input UpdateUserInput {\n    id: Int!\n    name: String\n    mediaSource: String\n  }\n\n  input CreatePostInput {\n    title: String\n    user_id: Int!\n    mediasSource: [String]!\n  }\n\n  input UpdatePostInput {\n    id: Int!\n    title: String\n    mediasSource: [String]\n  }\n\n  input CreateCommentInput {\n    body: String\n    user_id: Int!\n    post_id: Int!\n  }\n\n  # Responses\n  type DeleteDefaultResponse implements MutationResponse {\n    success: Boolean!\n    message: String!\n  }\n\n  type CrudUserResponse implements MutationResponse {\n    success: Boolean!\n    message: String!\n    data: User!\n  }\n\n  type CrudPostResponse implements MutationResponse {\n    success: Boolean!\n    message: String!\n    data: Post!\n  }\n\n  type CrudCommentResponse implements MutationResponse {\n    success: Boolean!\n    message: String!\n    data: Comment\n  }\n"])));
var templateObject_1;

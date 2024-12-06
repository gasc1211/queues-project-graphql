import { UserResolvers } from "./Users.js"
import { PostResolvers } from "./Posts.js";
import { RoleResolvers } from "./Roles.js";
import { CommentResolvers } from "./Comments.js";

import { mergeResolvers } from "@graphql-tools/merge";
import { PostsCountResolvers } from "./PostsCount.js";

const resolversArray = [
  UserResolvers,
  RoleResolvers,
  PostResolvers,
  CommentResolvers,
  PostsCountResolvers
];

export const resolvers = mergeResolvers(resolversArray); 
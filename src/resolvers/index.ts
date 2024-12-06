import { UserResolvers } from "./Users.js"
import { PostResolvers } from "./Posts.js";
import { RoleResolvers } from "./Roles.js";
import { CommentResolvers } from "./Comments.js";

import { mergeResolvers } from "@graphql-tools/merge";

const resolversArray = [
  UserResolvers,
  RoleResolvers,
  PostResolvers,
  CommentResolvers
];

export const resolvers = mergeResolvers(resolversArray); 
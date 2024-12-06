export const typeDefs = `#graphql

  type User{
    user_id: ID!
    first_name: String
    last_name: String
    email: String
    posts: [Post]
    roles: [Role] 
  }
  
  type Role {
    role_id: ID!
    description: String 
  }

  type UserRole {
    user: User
    role: Role
  }

  type Post {
    post_id: ID!
    content: String
    author: User
    comments: [Comment]
  }
  
  type Comment {
    comment_id: ID!
    content: String
    author: User
    post: Post
  }

  type PostsCount {
    author_id: Int
    posts_count: Int
  }

  type Query {
    Users(user_id: Int): [User]
    Posts(post_id: Int): [Post]
    Roles(role_id: Int): [Role]
    Comments(comment_id: Int): [Comment]
    PostsCount(author_id: Int): PostsCount
  }

`;
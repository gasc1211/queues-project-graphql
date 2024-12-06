import { ConnectionPool } from "mssql";
import { getConnection, sql } from "../database/connection.js";

export const PostResolvers = {
  Query: {
    Posts: async (_: any, args: any) => {
      try {
        const pool: ConnectionPool = await getConnection();
        const request = pool.request();

        let command = "SELECT post_id, content FROM acc.posts";

        if (args.post_id) {
          request.input("post_id", sql.Int, args.post_id);
          command += " WHERE post_id=@post_id"
        }

        const result = await request.query(command);
        return result.recordset;

      } catch (err) {
        console.error(err);
      }
    }
  },
  Post: {
    author: async (parent) => {
      try {
        const pool: ConnectionPool = await getConnection();
        const request = pool.request();

        let command = `
          SELECT 
            user_id, first_name, last_name, email
          FROM acc.users
          INNER JOIN acc.posts ON author_id = user_id
          WHERE post_id = @post_id
          `;

        const result = await request.input('post_id', parent.post_id).query(command);
        return result.recordset[0];

      } catch (err) {
        console.error(err);
      }
    },
    comments: async (parent) => {
      try {
        const pool: ConnectionPool = await getConnection();
        const request = pool.request();

        let command = "SELECT comment_id, content FROM acc.comments WHERE post_id=@post_id";

        const result = await request.input("post_id", sql.Int, parent.post_id).query(command);
        return result.recordset;

      } catch (err) {
        console.error(err);
      }
    }
  },
}


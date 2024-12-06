import { ConnectionPool } from "mssql";
import { getConnection, sql } from "../database/connection.js";


export const CommentResolvers = {
  Query: {
    Comments: async (_, args) => {
      try {
        const pool: ConnectionPool = await getConnection();
        const request = pool.request();

        let command = "SELECT comment_id, content FROM acc.comments";

        if (args.comment_id) {
          request.input("comment_id", sql.Int, args.id);
          command += " WHERE comment_id=@comment_id"
        }

        const result = await request.query(command);
        return result.recordset;

      } catch (err) {
        console.error(err);
      }
    }
  },
  Comment: {
    author: async (parent) => {
      try {
        const pool: ConnectionPool = await getConnection();
        const request = pool.request();

        let command = `
          SELECT
            user_id, first_name, last_name, email
          FROM acc.users
          INNER JOIN acc.comments ON users.user_id = author_id
          WHERE comment_id=@comment_id
        `;

        const result = await request.input('comment_id', parent.comment_id).query(command);
        return result.recordset[0];

      } catch (err) {
        console.error(err);
      }
    }
  },
}

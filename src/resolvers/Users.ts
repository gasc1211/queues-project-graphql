import { ConnectionPool } from "mssql";
import { getConnection, sql } from "../database/connection.js";

export const UserResolvers = {
  Query: {
    Users: async (_: any, args: any) => {
      try {
        const pool: ConnectionPool = await getConnection();
        const request = pool.request();

        let command = "SELECT user_id, first_name, last_name, email FROM acc.users";

        if (args.user_id) {
          request.input("user_id", sql.Int, args.user_id);
          command += " WHERE user_id=@user_id"
        }

        const result = await request.query(command);
        return result.recordset;

      } catch (err) {
        console.error(err);
      }
    }
  },
  User: {
    posts: async (parent) => {
      try {
        const pool: ConnectionPool = await getConnection();
        const request = pool.request();

        let command = `
          SELECT 
            post_id, content
          FROM acc.posts
          WHERE author_id = @author_id
          `;

        const result = await request.input('author_id', parent.user_id).query(command);

        return result.recordset.map(row => ({
          post_id: row.post_id,
          content: row.content
        }));

      } catch (err) {
        console.error(err);
      }
    },
    roles: async (parent) => {
      try {
        const pool: ConnectionPool = await getConnection();
        const request = pool.request();

        let command = `
          SELECT 
            R.role_id, R.description
          FROM acc.roles R
          INNER JOIN acc.user_roles UR ON UR.role_id = R.role_id
          INNER JOIN acc.users U ON U.user_id = UR.user_id
          WHERE U.user_id = @user_id
          `;

        const result = await request.input('user_id', sql.Int, parent.user_id).query(command);
        return result.recordset.map(row => ({
          role_id: row.role_id,
          description: row.description
        }));

      } catch (err) {
        console.error(err);
      }
    }
  },
}


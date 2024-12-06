import { getConnection } from "../database/connection.js"

export const PostsCountResolvers = {
  Query: {
    PostsCount: async () => {
      try {
        const pool = await getConnection();
        const result = await pool.request()
          .query(`
            SELECT 
              author_id,
              COUNT(post_id) AS posts_count
            FROM acc.users
            INNER JOIN acc.posts ON user_id = author_id
            GROUP BY author_id
          `);

        return result.recordset[0];
      } catch (err) {
        console.error(err);
      }
    }
  }
}
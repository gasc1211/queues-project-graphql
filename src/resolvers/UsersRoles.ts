import { ConnectionPool } from "mssql";
import { getConnection, sql } from "../database/connection.js";


export const UserRoleResolvers = {
  UserRole: {
    role: async (parent) => {
      try {
        const pool: ConnectionPool = await getConnection();
        const request = pool.request();

        let command = "SELECT role_id, user_id FROM acc.user_roles";

        if (parent.role_id) {
          request.input("role_id", sql.Int, parent.role_id);
          command += " WHERE role_id=@role_id"
        }

        const result = await request.query(command);
        return result.recordset;

      } catch (err) {
        console.error(err);
      }
    }
  }
}

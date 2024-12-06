import { ConnectionPool } from "mssql";
import { getConnection, sql } from "../database/connection.js";


export const RoleResolvers = {
  Query: {
    Roles: async (_, args) => {
      try {
        const pool: ConnectionPool = await getConnection();
        const request = pool.request();

        let command = "SELECT role_id, description FROM acc.roles";

        if (args.role_id) {
          request.input("role_id", sql.Int, args.id);
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
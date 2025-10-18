import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { roles } from "./roles.db";
import { permissions } from "./permissions.db";

export const rolePermissions = pgTable("role_permissions", {
    roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
},
    (table) => {
        return {
            compoundKey: primaryKey({ columns: [table.roleId, table.permissionId] }),
        }
    }
);
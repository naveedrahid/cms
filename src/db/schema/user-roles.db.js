import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./user.db";
import { roles } from "./roles.db";

export const userRoles = pgTable("user_roles", {
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
},
    (table) => {
        return {
            compoundKey: primaryKey({ columns: [table.userId, table.roleId] }),
        };
    });
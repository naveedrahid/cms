import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    description: text("description"),
    guardName: text("guard_name").default("web"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
    return {
        nameIndex: index("role_name_idx").on(table.name),
    }
});
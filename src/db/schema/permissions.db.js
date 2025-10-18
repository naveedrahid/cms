import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";

export const permissions = pgTable("permissions", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    description: text("description"),
    guardName: text("guard_name").default("web"),
    module: text("module"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
    return {
        nameIndex: index("permission_name_idx").on(table.name),
        moduleIndex: index("permission_module_idx").on(table.module),
    }

})
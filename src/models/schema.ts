import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";

export const CastleMarkers = sqliteTable("CastleMarkers", {
  index: integer("id").primaryKey({ autoIncrement: true }),
  id: text("key").notNull().unique(),
  name: text("name").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  scale: integer("scale").notNull(),
});

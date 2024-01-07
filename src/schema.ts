import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";

export const castles = sqliteTable("castles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  desc: text("desc"),
  history: text("history"),
  build_year: integer("build_year"),
  type_id: integer("type_id").references(() => types.id),
  site: text("site"),
});

export const castleAliases = sqliteTable("castle_aliases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  alias: text("alias").notNull(),
  castle_id: integer("castle_id").references(() => castles.id),
});

export const castleLords = sqliteTable("castle_lords", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  from: text("from"),
  to: text("to"),
  castle_id: integer("castle_id").references(() => castles.id),
});

export const castleCoordinates = sqliteTable("castle_coordinates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  lat: text("latitude"),
  lng: text("longitude"),
  castle_id: integer("castle_id").references(() => castles.id),
});

export const castlePlaces = sqliteTable("castle_places", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pref_id: integer("pref_id").references(() => prefs.id),
  area_id: integer("area_id").references(() => areas.id),
  city_id: integer("city_id").references(() => cities.id),
  address: text("address"),
  castle_id: integer("castle_id").references(() => castles.id),
});

export const prefs = sqliteTable("prefs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
});

export const areas = sqliteTable("areas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  pref_id: integer("pref_id").references(() => prefs.id),
});

export const cities = sqliteTable("cities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  pref_id: integer("pref_id").references(() => prefs.id),
  area_id: integer("area_id").references(() => areas.id),
});

export const castleTowers = sqliteTable("castle_towers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  layer: integer("layer"),
  floor: integer("floor"),
  condition_id: integer("condition_id").references(
    () => castleTowerConditions.id
  ),
  castle_id: integer("castle_id").references(() => castles.id),
});

export const castleTowerConditions = sqliteTable("castle_tower_conditions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  condition: text("name"),
});

export const types = sqliteTable("types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type"),
});

export const structures = sqliteTable("structures", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("structure"),
});

export const castleRemains = sqliteTable("castle_remains", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  structure_id: integer("structure_id").references(() => structures.id),
  castle_id: integer("castle_id").references(() => castles.id),
});

export const castleRestorations = sqliteTable("castle_restorations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  structure_id: integer("structure_id").references(() => structures.id),
  castle_id: integer("castle_id").references(() => castles.id),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category: text("category"),
});

export const castleCategories = sqliteTable("castle_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category_id: integer("category_id").references(() => categories.id),
  castle_id: integer("castle_id").references(() => castles.id),
});

export const castleImages = sqliteTable("castle_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url"),
  castle_id: integer("castle_id").references(() => castles.id),
});

export const castleNearestStations = sqliteTable("castle_nearest_stations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  line: text("line"),
  distance: real("distance"),
  castle_id: integer("castle_id").references(() => castles.id),
});

import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";

export const Castles = sqliteTable("Castles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  desc: text("desc"),
  history: text("history"),
  build_year: integer("build_year"),
  typeId: integer("type_id").references(() => Types.id),
  site: text("site"),
});

export const CastleAliases = sqliteTable("castle_aliases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  alias: text("alias").notNull(),
  castleId: integer("castle_id").references(() => Castles.id),
});

export const CastleLords = sqliteTable("castle_lords", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  from: text("from"),
  to: text("to"),
  castleId: integer("castle_id").references(() => Castles.id),
});

export const CastleCoordinates = sqliteTable("castle_coordinates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  lat: real("latitude"),
  lng: real("longitude"),
  castleId: integer("castle_id").references(() => Castles.id),
});

export const Prefs = sqliteTable("prefs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
});

export const Areas = sqliteTable("areas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  prefId: integer("pref_id").references(() => Prefs.id),
});

export const Cities = sqliteTable("cities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  prefId: integer("pref_id").references(() => Prefs.id),
  areaId: integer("area_id").references(() => Areas.id),
});

export const CastlePlaces = sqliteTable("castle_places", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  prefId: integer("pref_id").references(() => Prefs.id),
  areaId: integer("area_id").references(() => Areas.id),
  cityId: integer("city_id").references(() => Cities.id),
  address: text("address"),
  castleId: integer("castle_id").references(() => Castles.id),
});

export const CastleTowerConditions = sqliteTable("castle_tower_conditions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  condition: text("name"),
});

export const CastleTowers = sqliteTable("castle_towers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  layer: integer("layer"),
  floor: integer("floor"),
  conditionId: integer("condition_id").references(
    () => CastleTowerConditions.id
  ),
  castleId: integer("castle_id").references(() => Castles.id),
});

export const Types = sqliteTable("types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type"),
});

export const Structures = sqliteTable("structures", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("structure"),
});

export const CastleRemains = sqliteTable("castle_remains", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  structure_id: integer("structure_id").references(() => Structures.id),
  castleId: integer("castle_id").references(() => Castles.id),
});

export const CastleRestorations = sqliteTable("castle_restorations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  structure_id: integer("structure_id").references(() => Structures.id),
  castleId: integer("castle_id").references(() => Castles.id),
});

export const Categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category: text("category"),
});

export const CastleCategories = sqliteTable("castle_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category_id: integer("category_id").references(() => Categories.id),
  castleId: integer("castle_id").references(() => Castles.id),
});

export const CastleImages = sqliteTable("castle_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url"),
  castleId: integer("castle_id").references(() => Castles.id),
});

export const CastleNearestStations = sqliteTable("castle_nearest_stations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  line: text("line"),
  distance: real("distance"),
  castleId: integer("castle_id").references(() => Castles.id),
});

import { Context } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { Bindings } from "..";
import {
  Areas,
  CastleAliases,
  CastleCategories,
  CastleCoordinates,
  CastleImages,
  CastleLords,
  CastleNearestStations,
  CastlePlaces,
  CastleRemains,
  CastleTowers,
  Castles,
  Categories,
  Cities,
  Prefs,
  Types,
  CastleRestorations,
  Structures,
} from "../models/schema";
import { eq, inArray } from "drizzle-orm";
import { Castle } from "../types/castle";

type ContextType = Context<{ Bindings: Bindings }, "/castle/get/:id", {}>;

export class CastleController {
  private static async getOne(c: ContextType, id: number) {
    const db = drizzle(c.env.DB);
    const castle = await db
      .select()
      .from(Castles)
      .where(eq(Castles.id, id))
      .leftJoin(CastleAliases, eq(Castles.id, CastleAliases.castleId))
      .leftJoin(CastleLords, eq(Castles.id, CastleLords.castleId))
      .leftJoin(CastleCoordinates, eq(Castles.id, CastleCoordinates.castleId))
      .leftJoin(CastlePlaces, eq(Castles.id, CastlePlaces.castleId))
      .leftJoin(Prefs, eq(Prefs.id, CastlePlaces.prefId))
      .leftJoin(Areas, eq(Areas.id, CastlePlaces.areaId))
      .leftJoin(Cities, eq(Cities.id, CastlePlaces.cityId))
      .leftJoin(CastleTowers, eq(Castles.id, CastleTowers.castleId))
      .leftJoin(CastleRemains, eq(Castles.id, CastleRemains.castleId))
      .leftJoin(Castles, eq(Castles.id, CastleRemains.castleId))
      .leftJoin(CastleCategories, eq(Castles.id, CastleCategories.castleId))
      .leftJoin(CastleImages, eq(Castles.id, CastleImages.castleId))
      .leftJoin(
        CastleNearestStations,
        eq(Castles.id, CastleNearestStations.castleId)
      );
    return castle;
  }

  public static async getCastle(c: ContextType, id: number) {
    if (isNaN(id)) return c.json({ error: "id is not a number." }, 400);

    const castle = await this.getOne(c, id);

    return c.json({ castle });
  }

  public static async addCastle(c: ContextType, castle: Castle) {
    const db = drizzle(c.env.DB);
    await db.transaction(async (tx) => {
      const typeId = castle.type
        ? (
            await tx
              .select({ typeId: Types.id })
              .from(Types)
              .where(eq(Types.type, castle.type))
          )[0].typeId
        : null;

      // 城の情報を登録
      const castleObj = {
        id: castle.id,
        name: castle.name,
        desc: castle.desc,
        history: castle.history,
        build_year: castle.build_year,
        typeId,
        site: castle.site,
      };
      await tx.insert(Castles).values(castleObj);

      // 別名を登録
      if (castle.alias) {
        const aliasObj = castle.alias.map((alias) => ({
          alias,
          castleId: castle.id,
        }));
        await tx.insert(CastleAliases).values(aliasObj);
      }

      // 城主を登録
      if (castle.lords) {
        const lordObj = castle.lords.map((lord) => ({
          name: lord.name,
          from: lord.from?.toString(),
          to: lord.to?.toString(),
          castleId: castle.id,
        }));
        await tx.insert(CastleLords).values(lordObj);
      }

      // 座標を登録
      if (castle.coordinates) {
        const coordinatesObj = {
          lat: castle.coordinates.lat,
          lng: castle.coordinates.lng,
          castleId: castle.id,
        };
        await tx.insert(CastleCoordinates).values(coordinatesObj);
      }

      // 場所を登録
      if (castle.place) {
        const placeObj = {
          prefId: castle.place.pref.id,
          areaId: castle.place.area.id,
          cityId: castle.place.city.id,
          address: castle.place.address,
          castleId: castle.id,
        };
        await tx.insert(CastlePlaces).values(placeObj);
      }

      // 天守の状況を登録
      const tower = castle.castle_tower;
      if (tower) {
        const towerObj = {
          layers: tower?.structure?.layers,
          floors: tower.structure?.floors,
          condition: tower.condition,
          castleId: castle.id,
        };
        await tx.insert(CastleTowers).values(towerObj);
      }

      // 遺構を登録
      if (castle.remains) {
        const structureIds = await tx
          .select({ structureId: CastleTowers.id })
          .from(CastleTowers)
          .where(inArray(Structures.name, castle.remains));
        const remainsObj = structureIds.map((remain) => ({
          structureId: remain.structureId,
          castleId: castle.id,
        }));
        await tx.insert(CastleRemains).values(remainsObj);
      }

      // 復元を登録
      if (castle.restorations) {
        const structureIds = await tx
          .select({ structureId: CastleTowers.id })
          .from(CastleTowers)
          .where(inArray(Structures.name, castle.restorations));
        const restorationsObj = structureIds.map((remain) => ({
          structureId: remain.structureId,
          castleId: castle.id,
        }));
        await tx.insert(CastleRestorations).values(restorationsObj);
      }

      // カテゴリを登録
      if (castle.categories) {
        const categoryIds = await tx
          .select({ id: Categories.id })
          .from(Categories)
          .where(inArray(Categories.category, castle.categories));
        await tx.insert(CastleCategories).values(categoryIds);
      }

      // 画像を登録
      if (castle.images) {
        const imageObj = castle.images.map((image) => ({
          image,
          castleId: castle.id,
        }));
        await tx.insert(CastleImages).values(imageObj);
      }

      // ガイドを登録
      if (castle.guide) {
        const guideObj = {
          name: castle.guide.nearest_station?.name,
          line: castle.guide.nearest_station?.line,
          distance: castle.guide.nearest_station?.distance,
          castleId: castle.id,
        };
        await tx.insert(CastleNearestStations).values(guideObj);
      }
    });
    return c.json({ castle });
  }

  public static async addCategories(c: ContextType, categories_: string[]) {
    const db = drizzle(c.env.DB);
    const cateObj = categories_.map((category) => ({ category }));
    const res = await db.insert(Categories).values(cateObj).returning();
    return c.json({ categories: res });
  }

  public static async getCategories(c: ContextType) {
    const db = drizzle(c.env.DB);
    const categories = await db.select().from(Categories);
    return c.json({ categories });
  }
}

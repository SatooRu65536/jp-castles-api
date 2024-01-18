import { drizzle } from "drizzle-orm/d1";
import { CastleMarkers } from "../models/schema";
import { and, between, gte } from "drizzle-orm";
import { CastleMarker } from "../types/map";
import { ContextMarkers } from "../types/context";
import { MarkerRes } from "../types/response";

export class CastleController {
  /**
   * マーカーを取得する
   * @param c {ContextMarkers} Context
   * @returns {Promise<MarkerRes>} Response
   */
  public static async getMarkers(c: ContextMarkers): Promise<MarkerRes> {
    const latMin = Number(c.req.queries("latMin"));
    const latMax = Number(c.req.queries("latMax"));
    const lngMin = Number(c.req.queries("lngMin"));
    const lngMax = Number(c.req.queries("lngMax"));
    const scale = Number(c.req.queries("scale"));

    if (isNaN(latMin) || isNaN(latMax) || isNaN(lngMin) || isNaN(lngMax)) {
      const message =
        '"latMin", "latMax", "lngMin" and "lngMin" must all be specified';
      return c.json({ message }, 400);
    }

    const db = drizzle(c.env.DB);
    const markers = await db
      .select()
      .from(CastleMarkers)
      .where(
        and(
          between(CastleMarkers.lat, latMin, latMax),
          between(CastleMarkers.lng, lngMin, lngMax),
          gte(CastleMarkers.scale, isNaN(scale) ? 0 : scale)
        )
      );

    const castleMarkers: CastleMarker[] = markers.map((m) => {
      return {
        id: m.id,
        name: m.name,
        coordinates: {
          lat: m.lat,
          lng: m.lng,
        },
        scale: m.scale,
      };
    });

    return c.json<{ markers: CastleMarker[] }>({ markers: castleMarkers });
  }

  /**
   * マーカーを登録する
   * @param c {ContextMarkers} Context
   * @returns {Promise<MarkerRes>} Response
   */
  public static async postMarkers(c: ContextMarkers): Promise<MarkerRes> {
    const body = await c.req.json();

    const db = drizzle(c.env.DB);

    return c.json({ message: "hi" });
  }
}

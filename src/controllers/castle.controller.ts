import { drizzle } from "drizzle-orm/d1";
import { CastleMarkers } from "../models/schema";
import { and, between, gte, inArray } from "drizzle-orm";
import { CastleMarker } from "../types/map";
import { ContextMarkers } from "../types/context";
import { MarkerIdsRes, MarkerRes } from "../types/response";
import { PostMarkersReq, deleteMarkersReq } from "../types/request";
import { MarkerService } from "../service/marker.service";

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
      )
      .then((r) => MarkerService.toCastles(r))
      .catch((e) => null);

    if (markers) return c.json<{ markers: CastleMarker[] }>({ markers });

    const message = "error occurred when selecting on the database";
    return c.json({ message }, 500);
  }

  /**
   * マーカーを登録する
   * @param c {ContextMarkers} Context
   * @returns {Promise<MarkerRes>} Response
   */
  public static async postMarkers(c: ContextMarkers): Promise<MarkerRes> {
    const { markers } = await c.req.json<PostMarkersReq>();

    const markerSnap = markers.map((m) => ({
      id: `${m.name}_${m.coordinates.lat}_${m.coordinates.lng}`,
      name: m.name,
      lat: m.coordinates.lat,
      lng: m.coordinates.lng,
      scale: m.scale,
    }));

    const db = drizzle(c.env.DB);

    const response = await db
      .insert(CastleMarkers)
      .values(markerSnap)
      .returning()
      .then((r) => c.json({ markers: MarkerService.toCastles(r) }))
      .catch((e) => null);

    if (response) return response;

    // markerSnap[].id が重複しているものを取得する
    const ids = markerSnap.map((m) => m.id);
    const dupMarkers = await db
      .select()
      .from(CastleMarkers)
      .where(inArray(CastleMarkers.id, ids));

    const dupMarkersSnap = MarkerService.toCastles(dupMarkers);

    return c.json(
      {
        message: "Attempting to register multiple times.",
        markers: dupMarkersSnap,
      },
      500
    );
  }

  /**
   * マーカーを削除する
   * @param c {ContextMarkers} Context
   * @returns {Promise<MarkerRes>} Response
   */
  public static async deleteMarkers(c: ContextMarkers): Promise<MarkerIdsRes> {
    const db = drizzle(c.env.DB);

    const { ids } = await c.req.json<deleteMarkersReq>();
    console.log(ids);

    const resultIds = await db
      .delete(CastleMarkers)
      .where(inArray(CastleMarkers.id, ids))
      .returning({ id: CastleMarkers.id });

    if (resultIds) return c.json({ ids: resultIds.map((r) => r.id) });

    const message = "error occurred when deleting on the database";
    return c.json({ message }, 500);
  }
}

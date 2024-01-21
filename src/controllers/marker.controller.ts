import { and, between, count, eq, gte, inArray, max } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { CastleMarkers } from '../models/schema';
import { MarkerService } from '../service/marker.service';
import { ContextMarkerData, ContextMarkers } from '../types/context';
import { CastleMarker } from '../types/map';
import {
  PostMarkersReq,
  PutMarkerReq,
  deleteMarkersReq,
} from '../types/request';
import {
  MarkerDataRes,
  MarkerIdsRes,
  MarkerRes,
  MarkersRes,
} from '../types/response';

export class MarkerController {
  /**
   * マーカーを取得する
   * @param c {ContextMarkers} Context
   * @returns {Promise<MarkersRes>} Response
   */
  public static async getMarkers(c: ContextMarkers): Promise<MarkersRes> {
    const latMin = Number(c.req.queries('latMin'));
    const latMax = Number(c.req.queries('latMax'));
    const lngMin = Number(c.req.queries('lngMin'));
    const lngMax = Number(c.req.queries('lngMax'));
    const scale = Number(c.req.queries('scale'));

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
      .catch(() => null);

    if (markers) return c.json<{ markers: CastleMarker[] }>({ markers });

    const message = 'error occurred when selecting on the database';
    return c.json({ message }, 500);
  }

  /**
   * マーカーを登録する
   * @param c {ContextMarkers} Context
   * @returns {Promise<MarkersRes>} Response
   */
  public static async postMarkers(c: ContextMarkers): Promise<MarkersRes> {
    const { markers } = await c.req.json<PostMarkersReq>();

    const markerSnap = markers.map((m) => ({
      id: `${m.name}_${m.coordinates.lat}_${m.coordinates.lng}`,
      name: m.name,
      lat: m.coordinates.lat,
      lng: m.coordinates.lng,
      scale: m.scale,
      updateAt: new Date().getTime(),
    }));

    const db = drizzle(c.env.DB);

    const response = await db
      .insert(CastleMarkers)
      .values(markerSnap)
      .returning()
      .then((r) => ({ markers: MarkerService.toCastles(r) }))
      .catch(() => null);

    if (response) return c.json(response);

    // markerSnap[].id が重複しているものを取得する
    const ids = markerSnap.map((m) => m.id);
    const dupMarkers = await db
      .select()
      .from(CastleMarkers)
      .where(inArray(CastleMarkers.id, ids));

    const dupMarkersSnap = MarkerService.toCastles(dupMarkers);

    return c.json(
      {
        message: 'Attempting to register multiple times.',
        markers: dupMarkersSnap,
      },
      500
    );
  }

  /**
   * マーカーを更新する
   * @param c {ContextMarkers} Context
   * @returns {Promise<MarkersRes>} Response
   */
  public static async putMarkers(c: ContextMarkers): Promise<MarkerRes> {
    const { marker } = await c.req.json<PutMarkerReq>();

    const markerSnap = {
      id: marker.id,
      name: marker.name,
      lat: marker.coordinates.lat,
      lng: marker.coordinates.lng,
      scale: marker.scale,
      updateAt: new Date().getTime(),
    };

    const db = drizzle(c.env.DB);

    const response = await db
      .update(CastleMarkers)
      .set(markerSnap)
      .where(eq(CastleMarkers.id, markerSnap.id))
      .returning()
      .then((r) => ({ marker: MarkerService.toCastle(r[0]) }))
      .catch(() => null);

    if (response) return c.json(response);

    const message = 'error occurred when updating on the database';
    return c.json({ message }, 500);
  }

  /**
   * マーカーを削除する
   * @param c {ContextMarkers} Context
   * @returns {Promise<MarkersRes>} Response
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

    const message = 'error occurred when deleting on the database';
    return c.json({ message }, 500);
  }

  /**
   * マーカーのデータを取得する
   * @param c {ContextMarkers} Context
   * @returns {Promise<MarkerDataRes>} Response
   */
  public static async getMarkerData(
    c: ContextMarkerData
  ): Promise<MarkerDataRes> {
    const db = drizzle(c.env.DB);

    const result = await db
      .select({
        updateAt: max(CastleMarkers.updateAt),
        num: count(CastleMarkers.id),
      })
      .from(CastleMarkers);

    const { updateAt, num } = result[0];
    if (updateAt === null) {
      const message = 'cannot find last update';
      return c.json({ message }, 500);
    }

    const data = { num, updateAt: Number(updateAt) };
    return c.json({ data });
  }
}

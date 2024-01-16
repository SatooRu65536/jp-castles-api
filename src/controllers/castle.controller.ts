import { Context } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { Bindings } from "..";
import { Castle } from "../types/firestore";
import { CastleMarkers } from "../models/schema";
import { and, between, gte } from "drizzle-orm";
import { CastleMarker } from "../types/map";

export class CastleController {
  public static async getCastleMarkerByLatLngRange(
    c: Context<{ Bindings: Bindings }, "/markers", {}>,
    latRange: [number, number],
    lngRange: [number, number],
    scale: number
  ) {
    if (
      isNaN(latRange[0]) ||
      isNaN(latRange[1]) ||
      isNaN(lngRange[0]) ||
      isNaN(lngRange[1])
    ) {
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
          between(CastleMarkers.lat, latRange[0], latRange[1]),
          between(CastleMarkers.lng, lngRange[0], lngRange[1]),
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

    return c.json({ markers: castleMarkers });
  }
}

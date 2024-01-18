import { Context } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { Bindings } from "..";
import { CastleMarkers } from "../models/schema";
import { and, between, gte } from "drizzle-orm";
import { CastleMarker } from "../types/map";

export class CastleController {
  public static async getCastleMarkersByLatlng(
    c: Context<{ Bindings: Bindings }, "/markers", {}>
  ) {
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

    return c.json({ markers: castleMarkers });
  }
}

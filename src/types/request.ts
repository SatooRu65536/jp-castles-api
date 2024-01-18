import { CastleMarker } from "./map";

export type GetMarkersReq = {
  latMin: string;
  latMax: string;
  lngMin: string;
  lngMax: string;
  scale?: string;
};

export type PostMarkersReq = { markers: Omit<CastleMarker, "id">[] };

export type deleteMarkersReq = { ids: string[] };

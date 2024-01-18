import { Context, TypedResponse } from "hono";
import { CastleMarker } from "./map";

type MarkersResObj = { markers: CastleMarker[] };

type Error = { message: string; markers?: CastleMarker[] };

export type ErrorRes = Response & TypedResponse<Error>;
export type MarkerRes = (Response & TypedResponse<MarkersResObj>) | ErrorRes;

import { Context, TypedResponse } from "hono";
import { CastleMarker, MarkerData } from "./map";

type MarkersResObj = { markers: CastleMarker[] };

type Error = { message: string };
export type ErrorRes = Response & TypedResponse<Error>;
type MarkerError = Error & { markers?: CastleMarker[] };

export type MarkerErrorRes = Response & TypedResponse<MarkerError>;
export type MarkerRes =
  | (Response & TypedResponse<MarkersResObj>)
  | MarkerErrorRes;
export type MarkerIdsRes =
  | (Response & TypedResponse<{ ids: string[] }>)
  | MarkerErrorRes;

export type MarkerDataRes =
  | (Response & TypedResponse<{ data: MarkerData }>)
  | ErrorRes;

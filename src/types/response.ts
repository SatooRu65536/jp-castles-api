import { TypedResponse } from 'hono';
import { CastleMarker, MarkerData } from './map';

type MarkersResObj = { markers: CastleMarker[] };
type MarkerResObj = { marker: CastleMarker };

type Error = { message: string };
export type ErrorRes = Response & TypedResponse<Error>;
type MarkersError = Error & { markers?: CastleMarker[] };
type MarkerError = Error & { markers?: CastleMarker };

export type MarkersErrorRes = Response & TypedResponse<MarkersError>;
export type MarkerErrorRes = Response & TypedResponse<MarkerError>;

export type MarkersRes =
  | (Response & TypedResponse<MarkersResObj>)
  | MarkersErrorRes;
export type MarkerRes =
  | (Response & TypedResponse<MarkerResObj>)
  | MarkerErrorRes;
export type MarkerIdsRes =
  | (Response & TypedResponse<{ ids: string[] }>)
  | MarkersErrorRes;

export type MarkerDataRes =
  | (Response & TypedResponse<{ data: MarkerData }>)
  | ErrorRes;

export type Coordinates = {
  lat: number;
  lng: number;
};

export type CastleMarker = {
  id: string;
  name: string;
  coordinates: Coordinates;
  scale: number;
};

export type FlatCastleMarker = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  scale: number;
};

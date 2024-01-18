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

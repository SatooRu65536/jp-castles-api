import { MARKER_COLOR_NAMES } from "@/const/marker";
import { StaticImageData } from "next/image";

export type MarkerColor = (typeof MARKER_COLOR_NAMES)[number];

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

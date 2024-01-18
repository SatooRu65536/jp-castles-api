import { CastleMarker, FlatCastleMarker } from "../types/map";

export class MarkerService {
  /**
   * マーカーをフラットに変換する
   * @param marker {CastleMarker} マーカー
   * @returns {FlatCastleMarker} フラットなマーカー
   */
  public static toFlatCastle(marker: CastleMarker): FlatCastleMarker {
    return {
      id: marker.id,
      name: marker.name,
      lat: marker.coordinates.lat,
      lng: marker.coordinates.lng,
      scale: marker.scale,
    };
  }

  /**
   * マーカーをフラットに変換する
   * @param markers {CastleMarker[]} マーカー
   * @returns {FlatCastleMarker[]} フラットなマーカー
   */
  public static toFlatCastles(markers: CastleMarker[]): FlatCastleMarker[] {
    return markers.map((m) => this.toFlatCastle(m));
  }

  /**
   * フラットマーカーをマーカーに変換する
   * @param marker {FlatCastleMarker} マーカー
   * @returns {CastleMarker} マーカー
   */
  public static toCastle(marker: FlatCastleMarker): CastleMarker {
    return {
      id: marker.id,
      name: marker.name,
      coordinates: {
        lat: marker.lat,
        lng: marker.lng,
      },
      scale: marker.scale,
    };
  }

  /**
   * フラットマーカーをマーカーに変換する
   * @param markers {FlatCastleMarker[]} マーカー
   * @returns {CastleMarker[]} マーカー
   */
  public static toCastles(markers: FlatCastleMarker[]): CastleMarker[] {
    return markers.map((m) => this.toCastle(m));
  }
}

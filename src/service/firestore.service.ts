import { getFirestore } from "firebase-admin/firestore";
import { Castle, Region } from "../types/firestore/castle";
import { CastleMarker } from "../types/map";

const db = getFirestore();

class CastleFirestore {
  private regions: Region[] | null = null;

  /**
   * @description Firestoreから城のデータを取得する
   * @returns {Promise<Region[]>} 城のデータ
   */
  private async initRegions(): Promise<Region[]> {
    const regions = await db.collection("main").doc("castles").get();
    return regions.data() as Region[];
  }

  /**
   * @description 城一覧を取得する
   * @returns {Castle[]} 城一覧
   */
  public async getCastles(): Promise<Castle[]> {
    if (this.regions === null) this.regions = await this.initRegions();

    const castles: Castle[] = this.regions
      .map((r) => {
        return r.prefectures.map((p) => {
          return p.area.map((a) => {
            return a.city.map((c) => {
              return c.castles;
            });
          });
        });
      })
      .flat(4);

    return castles;
  }

  public async getCastleMarkers(): Promise<CastleMarker[]> {
    if (this.regions === null) this.regions = await this.initRegions();

    const markers: CastleMarker[] = this.regions
      .map((r) => {
        return r.prefectures.map((p) => {
          return p.area.map((a) => {
            return a.city.map((c) => {
              return c.castles.map((c) => {
                return {
                  id: c.id,
                  name: c.name,
                  coordinates: {
                    lat: c.coordinates.lat,
                    lng: c.coordinates.lng,
                  },
                  scale: c.scale,
                };
              });
            });
          });
        });
      })
      .flat(5);

    return markers.flat();
  }
}

export const castleFirestore = new CastleFirestore();

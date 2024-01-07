// 場所
export type Place = {
  pref: { name: string; id: number };
  area: { name: string; id: number };
  city: { name: string; id: number };
  address?: string;
};

// 城主
export type Lord = {
  name?: string | null;
  from?: number;
  to?: number;
};

// 天守の状況
export type TowerCondtion = {
  structure?: {
    layers?: number; // 層数
    floors?: number; // 階数
  };
  condition?: string; // 保存状態
};

// 座標
export type Coordinates = {
  lat: number;
  lng: number;
};

export type Guide = {
  nearest_station?: {
    name?: string; // 駅名
    line?: string; // 路線名
    distance?: number; // 距離
  };
};

export type Castle = {
  id: number;
  name: string; // 名称
  alias?: string[]; // 別名
  desc?: string; // 説明
  history?: string; // 歴史
  lords?: Lord[]; // 城主
  build_year?: number | null; // 築城年
  coordinates: Coordinates; // 座標
  place: Place; // 場所
  castle_tower?: TowerCondtion | null; // 天守の状況
  type?: string | null; // 種類
  remains?: string[]; // 遺構
  restorations?: string[]; // 復元
  categories?: string[];
  site?: string | null; // 公式サイト
  images?: string[]; // 画像
  guide?: Guide; // ガイド
};

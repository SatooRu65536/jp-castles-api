// 城主
export type Lord = {
  name: string | null;
  from: number;
  to: number;
};

// 天守の状況
export type TowerCondtion = {
  structure: {
    layers: number; // 層数
    floors: number; // 階数
  };
  condition: string; // 保存状態
};

// 座標
export type Coordinates = {
  lat: number;
  lng: number;
};

// 案内
export type Guide = {
  nearest_station: {
    name: string; // 駅名
    line: string; // 路線名
    distance: number; // 距離
  };
};

// 城
export type Castle = {
  id: string;
  name: string; // 名称
  alias: string[]; // 別名
  desc: string; // 説明
  history: string; // 歴史
  scale: number; // 規模
  lords: Lord[]; // 城主
  build_year: number; // 築城年
  coordinates: Coordinates; // 座標
  castle_tower: TowerCondtion; // 天守の状況
  type: string; // 種類
  remains: string[]; // 遺構
  restorations: string[]; // 復元
  categories: string[];
  site: string; // 公式サイト
  images: string[]; // 画像
  guide: Guide; // ガイド
};

// 地方
export type Region = {
  id: string;
  name: string;
  prefectures: Prefecture[];
};

// 都道府県
export type Prefecture = {
  id: string;
  name: string;
  area: Area[];
};

// 地域
export type Area = {
  id: string;
  name: string;
  city: City[];
};

// 市区町村
export type City = {
  id: string;
  name: string;
  castles: Castle[];
};

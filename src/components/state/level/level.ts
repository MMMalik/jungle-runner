export interface TileMap {
  layers: Array<{ data: number[] }>;
  height: number;
  tileheight: number;
  width: number;
  tilewidth: number;
}

export enum TileType {
  Blank = 'Blank',
  Platform = 'Platform',
  Coin = 'Coin',
}

export interface Tile {
  type: TileType;
  uid: string;
  tileId: number;
  tileWidth: number;
  tileHeight: number;
  x: number;
  y: number;
}

export interface PlatformTile extends Tile {
  hasNeighborLeft: boolean;
  hasNeighborRight: boolean;
  hasNeighborDown: boolean;
  hasNeighborUp: boolean;
}

export type CoinTile = Tile;

export type LevelTile = PlatformTile | CoinTile;

export const tileIdToType: {
  default: TileType;
  [key: number]: TileType;
} = {
  0: TileType.Blank,
  327: TileType.Coin,
  328: TileType.Coin,
  default: TileType.Platform,
};

export const createLevel = (jsonLevelMap: TileMap): LevelTile[][] => {
  const array2d = Array.from({ length: jsonLevelMap.height }).map((_, i) =>
    jsonLevelMap.layers[0].data.slice(
      i * jsonLevelMap.width,
      (i + 1) * jsonLevelMap.width
    )
  );
  return array2d.map((row, i) => {
    return row.map((tileId, j) => ({
      tileId,
      uid: `${i}_${j}`,
      type: tileIdToType[tileId] ? tileIdToType[tileId] : tileIdToType.default,
      tileWidth: jsonLevelMap.tilewidth,
      tileHeight: jsonLevelMap.tileheight,
      x: jsonLevelMap.tilewidth * j,
      y: jsonLevelMap.tileheight * i,
      hasNeighborLeft: !!array2d[i][j - 1],
      hasNeighborRight: !!array2d[i][j + 1],
      hasNeighborDown:
        i >= 0 && i < array2d.length - 1 ? !!array2d[i + 1][j] : false,
      hasNeighborUp: i > 0 && i < array2d.length ? !!array2d[i - 1][j] : false,
    }));
  });
};

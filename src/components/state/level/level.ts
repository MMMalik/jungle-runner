import { GameConst } from '../../../constants';

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
  Enemy = 'Enemy',
  Character = 'Character',
  Water = 'Water',
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

export type EnemyTile = Tile;

export type WaterTile = Tile;

export type CoinTile = Tile;

export type CharacterTile = Tile;

export type LevelTile = PlatformTile | CoinTile | CharacterTile | EnemyTile;

export const tileIdToType: {
  default: TileType;
  [key: number]: TileType;
} = {
  0: TileType.Blank,
  326: TileType.Character,
  327: TileType.Coin,
  328: TileType.Coin,
  331: TileType.Water,
  332: TileType.Enemy,
  default: TileType.Platform,
};

const hasPlatformNeightbour = (tileId: number) => {
  return !tileIdToType[tileId];
};

export const isCharacterTile = (tile: Tile) =>
  tileIdToType[tile.tileId] === TileType.Character;

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
      hasNeighborLeft: hasPlatformNeightbour(array2d[i][j - 1]),
      hasNeighborRight: hasPlatformNeightbour(array2d[i][j + 1]),
      hasNeighborDown:
        i >= 0 && i < array2d.length - 1 ? !!array2d[i + 1][j] : false,
      hasNeighborUp: i > 0 && i < array2d.length ? !!array2d[i - 1][j] : false,
    }));
  });
};

export const initWorld = (tileMap: TileMap) => {
  const tiles = createLevel(tileMap).reduce((acc, row) => row.concat(acc), []);

  const characterTile = tiles.find(isCharacterTile);

  if (!characterTile) {
    throw new Error('Missing Character tile!');
  }

  return {
    tiles,
    size: {
      x: 0,
      y: 0,
      width: tileMap.width * tileMap.tilewidth,
      height: tileMap.height * tileMap.tileheight,
    },
    camera: {
      vX: 0,
      x: 0,
      y: characterTile.y,
      width: GameConst.Camera.width,
      height: GameConst.Camera.height,
    },
  };
};

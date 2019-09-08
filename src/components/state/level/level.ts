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
  Totem = 'Totem',
  Wasp = 'Wasp',
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

export type TotemTile = Tile;

export type WaspTile = Tile;

export type WaterTile = Tile;

export type CoinTile = Tile;

export type CharacterTile = Tile;

export type LevelTile =
  | PlatformTile
  | CoinTile
  | CharacterTile
  | TotemTile
  | WaspTile;

export interface LevelDef {
  [key: string]: TileType;
}

export interface LevelDefWithDefault extends LevelDef {
  default: TileType;
}

export const relativeCustomTileIdToType: LevelDef = {
  0: TileType.Wasp,
  1: TileType.Character,
  2: TileType.Coin,
  3: TileType.Coin,
  6: TileType.Water,
  7: TileType.Totem,
};

const levelCustomTileStart: { [key: string]: number } = {
  1: 325,
  2: 785,
  3: 325,
};

const createLevelTileIdToTypeMap = (startNum: number): LevelDefWithDefault => {
  return Object.keys(relativeCustomTileIdToType).reduce(
    (acc, relativeNum) => {
      return {
        ...acc,
        [startNum + parseInt(relativeNum, 10)]: relativeCustomTileIdToType[
          relativeNum
        ],
      };
    },
    {
      0: TileType.Blank,
      default: TileType.Platform,
    }
  );
};

const hasPlatformNeightbour = (
  tileId: number,
  tileIdToType: LevelDefWithDefault
) => {
  return !tileIdToType[tileId];
};

export const isCharacterTile = (
  tile: Tile,
  tileIdToType: LevelDefWithDefault
) => tileIdToType[tile.tileId] === TileType.Character;

export const createLevel = (
  jsonLevelMap: TileMap,
  tileIdToType: LevelDefWithDefault
): LevelTile[][] => {
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
      hasNeighborLeft: hasPlatformNeightbour(array2d[i][j - 1], tileIdToType),
      hasNeighborRight: hasPlatformNeightbour(array2d[i][j + 1], tileIdToType),
      hasNeighborDown:
        i >= 0 && i < array2d.length - 1 ? !!array2d[i + 1][j] : false,
      hasNeighborUp: i > 0 && i < array2d.length ? !!array2d[i - 1][j] : false,
    }));
  });
};

export const initWorld = (tileMap: TileMap, level: number) => {
  const tileIdToType = createLevelTileIdToTypeMap(levelCustomTileStart[level]);
  const tiles = createLevel(tileMap, tileIdToType).reduce(
    (acc, row) => row.concat(acc),
    []
  );
  const characterTile = tiles.find(tile => isCharacterTile(tile, tileIdToType));

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

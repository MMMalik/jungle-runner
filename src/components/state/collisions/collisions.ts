import * as PIXI from 'pixi.js';
import { GameState, WorldObjects } from '../../../state';
import { PlatformTile, CoinTile, Tile } from '../level';
import { willCollideH, willCollideY, collide } from '../../../framework';

export interface CollisionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CharacterCollisions {
  characterCollisionsWithPlatform: {
    v: number;
    h: number;
  };
  characterCollisionsWithCoin?: {
    sprite: PIXI.Sprite;
    tile: Tile;
  };
}

export const CHARACTER_COLLISION_RECT = {
  width: 25,
  height: 45,
};

export const createCollisionBox = (box: CollisionBox) => {
  return {
    x: Math.ceil(box.x - box.width / 2),
    y: Math.ceil(box.y - box.height / 2),
    width: box.width,
    height: box.height,
  };
};

export const collidesWithCoin = (
  collisionBox: CollisionBox,
  coins: Array<{ sprite: PIXI.Sprite; tile: CoinTile }>
) => {
  return coins.find(({ sprite, tile }) => {
    const coinBox = {
      x: tile.x,
      y: tile.y,
      width: tile.tileWidth,
      height: tile.tileHeight,
    };
    return collide(collisionBox, coinBox);
  });
};

export const collidesWithPlatform = (
  collisionBox: CollisionBox,
  platform: Array<{ sprite: PIXI.Sprite; tile: PlatformTile }>,
  directedVx: number,
  directedVy: number
) => {
  return platform.reduce(
    (acc, { tile }) => {
      const tileBox = {
        x: tile.x,
        y: tile.y,
        width: tile.tileWidth,
        height: tile.tileHeight,
      };
      return {
        h:
          acc.h === 0 ? willCollideH(collisionBox, tileBox, directedVx) : acc.h,
        v:
          acc.v === 0 &&
          (!tile.hasNeighborUp || !tile.hasNeighborDown) &&
          acc.h === 0
            ? willCollideY(collisionBox, tileBox, directedVy)
            : acc.v,
      };
    },
    {
      h: 0,
      v: 0,
    }
  );
};

export const calculateCharacterCollisions = ({
  world,
  directedVx,
  directedVy,
}: {
  world: WorldObjects;
  directedVx: number;
  directedVy: number;
}): CharacterCollisions => {
  const { platform, coins, character } = world;
  const characterCollisionBox = createCollisionBox({
    x: character.x,
    y: character.y,
    width: CHARACTER_COLLISION_RECT.width,
    height: CHARACTER_COLLISION_RECT.height,
  });
  return {
    characterCollisionsWithPlatform: collidesWithPlatform(
      characterCollisionBox,
      platform.filter(
        ({ tile }) =>
          Math.abs(tile.x - characterCollisionBox.x) < 200 &&
          Math.abs(tile.y - characterCollisionBox.y) < 200
      ),
      directedVx,
      directedVy
    ),
    characterCollisionsWithCoin: collidesWithCoin(characterCollisionBox, coins),
  };
};

import * as PIXI from 'pixi.js';
import { GameState } from '../../../state';
import { PlatformTile, CoinTile } from '../level';
import {
  willCollideH,
  willCollideY,
  collide,
} from '../../../utils/collisions/collisions';

interface CollisionBox {
  x: number;
  y: number;
  width: number;
  height: number;
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
      x: sprite.x,
      y: sprite.y,
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
    (acc, { sprite, tile }) => {
      const tileBox = {
        x: sprite.x,
        y: sprite.y,
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

export const calculateCollisions = ({
  state,
  directedVx,
  directedVy,
}: {
  state: GameState;
  directedVx: number;
  directedVy: number;
}) => {
  const { platform, coins, character } = state.sprites;
  const characterCollisionBox = createCollisionBox({
    x: character.x,
    y: character.y,
    width: CHARACTER_COLLISION_RECT.width,
    height: CHARACTER_COLLISION_RECT.height,
  });
  return {
    characterCollisionsWithPlatform: collidesWithPlatform(
      characterCollisionBox,
      platform,
      directedVx,
      directedVy
    ),
    characterCollisionsWithCoin: collidesWithCoin(characterCollisionBox, coins),
  };
};

export default calculateCollisions;

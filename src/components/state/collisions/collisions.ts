import * as PIXI from 'pixi.js';
import { GameState } from '../../../state';
import { PlatformTile } from '../../platform/Platform';
import {
  willCollideH,
  willCollideY,
} from '../../../utils/collisions/collisions';
import { GameConst } from '../../../constants';

interface CollisionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const CHARACTER_COLLISION_RECT = {
  width: 25,
  height: 50,
};

export const createCollisionBox = (box: CollisionBox) => {
  return {
    x: Math.ceil(box.x - box.width / 2),
    y: Math.ceil(box.y - box.height / 2),
    width: box.width,
    height: box.height,
  };
};

export const collidesWithPlatform = (
  collisionBox: CollisionBox,
  platform: Array<{ sprite: PIXI.Sprite; tile: PlatformTile }>,
  directedVx: number
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
          acc.v === 0 && !tile.hasNeighborUp && acc.h === 0
            ? willCollideY(collisionBox, tileBox, GameConst.Gravity)
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
}: {
  state: GameState;
  directedVx: number;
}) => {
  const { platform, character } = state.sprites;
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
      directedVx
    ),
  };
};

export default calculateCollisions;

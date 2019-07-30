import * as PIXI from 'pixi.js';
import { GameComponent, ComponentCommonProps, Render } from '../component';
import { GameState } from '../../state';
import { PlatformTile } from '../platform/Platform';
import { willCollideH, willCollideY } from '../../utils/collisions/collisions';
import { CharacterConst, GameConst } from '../../constants';

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

export const createCollisionBox = (box: CollisionBox, margin: number) => {
  return {
    x: Math.ceil(box.x + margin - box.width / 2),
    y: Math.ceil(box.y + margin - box.height / 2),
    width: box.width - margin * 2,
    height: box.height - margin * 2,
  };
};

export const collidesWithPlatform = (
  collisionBox: CollisionBox,
  platform: Array<{ sprite: PIXI.Sprite; tile: PlatformTile }>
) => {
  let h = 0;
  let v = 0;
  platform.forEach(({ sprite, tile }) => {
    const tileBox = {
      x: sprite.x,
      y: sprite.y,
      width: tile.tileWidth,
      height: tile.tileHeight,
    };
    if (h === 0) {
      const hLeft = willCollideH(collisionBox, tileBox, -CharacterConst.BaseVx);
      const hRight = willCollideH(collisionBox, tileBox, CharacterConst.BaseVx);
      h = hRight || hLeft;
    }
    if (v === 0 && !tile.hasNeighborUp && h === 0) {
      v = willCollideY(collisionBox, tileBox, GameConst.Gravity);
    }
  });
  return { h, v };
};

export const render: Render<GameState, {}> = ({ state }) => {
  const { platform, character } = state.sprites;
  const characterCollisionBox = createCollisionBox(
    {
      x: character.x,
      y: character.y,
      width: CHARACTER_COLLISION_RECT.width,
      height: CHARACTER_COLLISION_RECT.height,
    },
    0
  );
  const collisions = collidesWithPlatform(characterCollisionBox, platform);
  state.character.collisions = {
    platformH: collisions.h,
    platformV: collisions.v,
  };
};

const Collisions: GameComponent<
  ComponentCommonProps,
  PIXI.Sprite,
  GameState
> = () => {
  return { render };
};

export default Collisions;

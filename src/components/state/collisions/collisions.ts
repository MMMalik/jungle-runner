import * as PIXI from 'pixi.js';
import { WorldObjects, Totems, Platform, Wasps } from '../../../state';
import { CoinTile, Tile, PlatformTile } from '../level';
import {
  willCollideH,
  willCollideY,
  collide,
  willCollideDiag,
} from '../../../framework';
import { Enemies } from '../../../constants/Enemies';
import { GameConst } from '../../../constants';

export interface CollisionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Collision {
  v: number;
  h: number;
}

export interface CollisionWithPlatform extends Collision {
  tile: PlatformTile;
}

export interface AllCollisions {
  characterCollisionsWithPlatform: Collision;
  characterCollisionsWithCoin?: {
    sprite: PIXI.Sprite;
    tile: Tile;
  };
  characterCollisionsWithTotems?: {
    sprite: PIXI.Sprite;
    tile: Tile;
  };
  totemsCollisionsWithPlatform: CollisionWithPlatform[][];
  waspsCollisionsWithPlatform: CollisionWithPlatform[][];
}

export const CHARACTER_COLLISION_RECT = {
  width: 25,
  height: 42,
};

export const TOTEM_COLLISION_RECT = {
  width: 22,
  height: 20,
};

export const COIN_COLLISION_RECT = {
  width: 10,
  height: 28,
};

const isWithinRange = (collisionBox: CollisionBox) => ({
  tile,
}: {
  tile: Tile;
}) => {
  return (
    Math.abs(tile.x - collisionBox.x) < 200 &&
    Math.abs(tile.y - collisionBox.y) < 200
  );
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
  return coins.find(coin => {
    const coinBox = {
      x: coin.tile.x,
      y: coin.tile.y,
      width: COIN_COLLISION_RECT.width,
      height: COIN_COLLISION_RECT.height,
    };
    return collide(collisionBox, coinBox);
  });
};

export const collidesWithTotem = (
  collisionBox: CollisionBox,
  totems: Totems
) => {
  return totems.find(totem => {
    const totemBox = createCollisionBox({
      x: totem.tile.x,
      y: totem.tile.y,
      width: TOTEM_COLLISION_RECT.width,
      height: TOTEM_COLLISION_RECT.height,
    });
    return collide(collisionBox, totemBox);
  });
};

export const collidesWithTiles = <E extends Tile>(
  collisionBox: CollisionBox,
  tiles: Array<{ tile: E; sprite: PIXI.Sprite }>,
  directedVx: number,
  directedVy: number
) => {
  return tiles.filter(isWithinRange(collisionBox)).map(({ tile }) => {
    const tileBox = {
      x: tile.x,
      y: tile.y,
      width: tile.tileWidth,
      height: tile.tileHeight,
    };
    return {
      h: willCollideH(collisionBox, tileBox, directedVx),
      v: willCollideY(collisionBox, tileBox, directedVy),
      diag: willCollideDiag(collisionBox, tileBox, directedVx, directedVy),
      tile,
    };
  });
};

export const collidesWithPlatformReduced = (
  collisionBox: CollisionBox,
  platform: Platform,
  directedVx: number,
  directedVy: number
) => {
  const c = platform.reduce(
    (acc, { tile }) => {
      const tileBox = {
        x: tile.x,
        y: tile.y,
        width: tile.tileWidth,
        height: tile.tileHeight,
      };
      const diag =
        acc.diag.h || acc.diag.v
          ? acc.diag
          : willCollideDiag(collisionBox, tileBox, directedVx, directedVy);
      return {
        h:
          acc.h === 0 ? willCollideH(collisionBox, tileBox, directedVx) : acc.h,
        v:
          acc.v === 0 &&
          (!tile.hasNeighborUp || !tile.hasNeighborDown) &&
          acc.h === 0
            ? willCollideY(collisionBox, tileBox, directedVy)
            : acc.v,
        diag,
      };
    },
    {
      h: 0,
      v: 0,
      diag: {
        h: 0,
        v: 0,
      },
    }
  );
  if (c.h || c.v) {
    return {
      h: c.h,
      v: c.v,
    };
  }
  return {
    h: c.diag.h ? c.diag.h : 0,
    v: 0,
  };
};

const totemsCollideWithPlatform = (totems: Totems, platform: Platform) => {
  return totems.map(totem => {
    return collidesWithTiles<PlatformTile>(
      createCollisionBox({
        x: totem.tile.x,
        y: totem.tile.y,
        width: TOTEM_COLLISION_RECT.width,
        height: TOTEM_COLLISION_RECT.height,
      }),
      platform,
      Enemies.Totems.vX * Math.round(totem.vX / Math.abs(totem.vX)),
      GameConst.Gravity
    ).filter(collision => collision.h || collision.v);
  });
};

const waspsCollideWithPlatform = (wasps: Wasps, platform: Platform) => {
  return wasps.map(wasp => {
    return collidesWithTiles<PlatformTile>(
      createCollisionBox({
        x: wasp.tile.x,
        y: wasp.tile.y,
        width: TOTEM_COLLISION_RECT.width,
        height: TOTEM_COLLISION_RECT.height,
      }),
      platform,
      Enemies.Totems.vX * Math.round(wasp.vX / Math.abs(wasp.vX)),
      0
    ).filter(collision => collision.h || collision.v);
  });
};

export const calculateCollisions = ({
  world,
  directedVx,
  directedVy,
}: {
  world: WorldObjects;
  directedVx: number;
  directedVy: number;
}): AllCollisions => {
  const { platform, coins, character, enemies } = world;
  const characterCollisionBox = createCollisionBox({
    x: character.x,
    y: character.y,
    width: CHARACTER_COLLISION_RECT.width,
    height: CHARACTER_COLLISION_RECT.height,
  });
  return {
    characterCollisionsWithPlatform: collidesWithPlatformReduced(
      characterCollisionBox,
      platform.filter(isWithinRange(characterCollisionBox)),
      directedVx,
      directedVy
    ),
    characterCollisionsWithCoin: collidesWithCoin(characterCollisionBox, coins),
    characterCollisionsWithTotems: collidesWithTotem(
      characterCollisionBox,
      enemies.totems
    ),
    totemsCollisionsWithPlatform: totemsCollideWithPlatform(
      enemies.totems,
      platform
    ),
    waspsCollisionsWithPlatform: totemsCollideWithPlatform(
      enemies.wasps,
      platform
    ),
  };
};

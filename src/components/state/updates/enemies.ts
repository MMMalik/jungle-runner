import { GameState, Totems, Wasps } from '../../../state';
import { AllCollisions, CollisionWithPlatform } from '../collisions';
import { Enemies } from '../../../constants/Enemies';
import { GameConst } from '../../../constants';

const calculateNextVx = (
  currentVx: number,
  hCollision?: CollisionWithPlatform,
  edgeTileLeft?: CollisionWithPlatform,
  edgeTileRight?: CollisionWithPlatform
) => {
  const unit = Math.round(currentVx / Math.abs(currentVx));
  if (hCollision) {
    if (Math.round(currentVx + hCollision.h) === 0) {
      return -Enemies.Totems.vX * unit;
    }
    return currentVx + hCollision.h;
  }
  if (edgeTileLeft) {
    return Enemies.Totems.vX;
  }
  if (edgeTileRight) {
    return -Enemies.Totems.vX;
  }
  return Enemies.Totems.vX * unit;
};

export const updateTotems = (
  { world }: GameState,
  { totemsCollisionsWithPlatform }: AllCollisions
): Totems => {
  return world.enemies.totems.map((t, i) => {
    const collisions = totemsCollisionsWithPlatform[i];

    const hCollision = collisions.find(collision => collision.h !== 0);
    const vCollision = collisions.find(collision => collision.v !== 0);
    const edgeTileLeft = collisions.find(
      collision =>
        collision.tile.hasNeighborRight && !collision.tile.hasNeighborLeft
    );
    const edgeTileRight = collisions.find(
      collision =>
        collision.tile.hasNeighborLeft && !collision.tile.hasNeighborRight
    );

    const vX = calculateNextVx(t.vX, hCollision, edgeTileLeft, edgeTileRight);
    const vY = vCollision
      ? GameConst.Gravity + vCollision.v
      : GameConst.Gravity;

    return {
      ...t,
      tile: {
        ...t.tile,
        x: t.tile.x + vX,
        y: t.tile.y + vY,
      },
      vX,
      vY,
    };
  });
};

export const updateWasps = (
  { world }: GameState,
  { waspsCollisionsWithPlatform }: AllCollisions
): Wasps => {
  return world.enemies.wasps.map((t, i) => {
    const collisions = waspsCollisionsWithPlatform[i];

    const hCollision = collisions.find(collision => collision.h !== 0);
    const edgeTileLeft = collisions.find(
      collision =>
        collision.tile.hasNeighborRight && !collision.tile.hasNeighborLeft
    );
    const edgeTileRight = collisions.find(
      collision =>
        collision.tile.hasNeighborLeft && !collision.tile.hasNeighborRight
    );

    const vX = calculateNextVx(t.vX, hCollision, edgeTileLeft, edgeTileRight);

    return {
      ...t,
      tile: {
        ...t.tile,
        x: t.tile.x + vX,
        y: t.tile.y,
      },
      vX,
    };
  });
};

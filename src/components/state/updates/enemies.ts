import { GameState, Totems } from '../../../state';
import { AllCollisions, TotemCollisionWithPlatform } from '../collisions';
import { Enemies } from '../../../constants/Enemies';

const calculateNextVx = (
  currentVx: number,
  hCollision?: TotemCollisionWithPlatform,
  edgeTileLeft?: TotemCollisionWithPlatform,
  edgeTileRight?: TotemCollisionWithPlatform
) => {
  const unit = Math.round(currentVx / Math.abs(currentVx));
  if (hCollision) {
    if (Math.round(currentVx + hCollision.h) === 0) {
      return -Enemies.Totems.vX * unit;
    }
    return currentVx + hCollision.h;
    // return -Enemies.Totems.vX * Math.round(currentVx / Math.abs(currentVx));
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
      },
      vX,
    };
  });
};

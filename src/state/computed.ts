import { Directions } from '../constants';
import { Coords } from '../framework';
import { WorldObjects } from './state';

export const getCharacterRunningDirection = (
  arrowRight: boolean,
  arrowLeft: boolean
) => (arrowLeft ? Directions.Left : arrowRight ? Directions.Right : 0);

export const shouldCharacterMoveX = (arrowRight: boolean, arrowLeft: boolean) =>
  arrowRight || arrowLeft;

export const isJumping = (ticks: number) => ticks > 0;

export const isCharacterPastTheMiddle = (
  canvas: HTMLCanvasElement,
  character: PIXI.Sprite
) => {
  const x = character.x - character.width / 2;
  return x > canvas.width / 2;
};

export const isOutsideWorld = (world: WorldObjects) =>
  world.size.width < world.character.x || world.size.height < world.character.y;

export const isOnTheGround = (verticalPenetration: number) =>
  Math.abs(verticalPenetration) !== 0;

export const getJumpTicks = (
  shouldStartJump: boolean,
  touchesCeiling: boolean,
  jumpTicks: number,
  maxJumpTicks: number
): number => {
  if (
    (shouldStartJump && !touchesCeiling) ||
    (jumpTicks > 0 && jumpTicks <= maxJumpTicks)
  ) {
    return jumpTicks + 1;
  }
  return 0;
};

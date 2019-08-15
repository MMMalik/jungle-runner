import { Directions } from '../constants';

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

export const isOutsideCanvas = (
  canvas: HTMLCanvasElement,
  sprite: PIXI.Sprite
) => canvas.width < sprite.x || canvas.height < sprite.y;

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

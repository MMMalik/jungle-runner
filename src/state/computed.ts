import { Directions } from '../constants';

export const getCharacterRunningDirection = (
  arrowRight: boolean,
  arrowLeft: boolean
) => (arrowLeft ? Directions.Left : arrowRight ? Directions.Right : 0);

export const shouldCharacterMoveX = (arrowRight: boolean, arrowLeft: boolean) =>
  arrowRight || arrowLeft;

export const isJumping = (ticks: number) => ticks > 0;

export const getJumpTicks = (
  shouldStartJump: boolean,
  touchesCeiling: boolean,
  jumpTicks: number,
  maxJumpTicks: number
): number => {
  if ((shouldStartJump && !touchesCeiling) || (jumpTicks > 0 && jumpTicks <= maxJumpTicks)) {
    return jumpTicks + 1;
  }
  return 0;
};

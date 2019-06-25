import { Directions } from '../constants';

export const runningDirection = (arrowRight: boolean, arrowLeft: boolean) =>
  arrowLeft ? Directions.Left : arrowRight ? Directions.Right : 0;

export const isRunning = (arrowRight: boolean, arrowLeft: boolean) =>
  arrowRight || arrowLeft;

export const isJumping = (ticks: number) => ticks > 0;

import { GameState } from '../../../state';
import { AllCollisions } from '../State';

export const updateGameScoreState = (
  { game: { score } }: GameState,
  { characterCollisions: { characterCollisionsWithCoin } }: AllCollisions
): number => {
  if (!characterCollisionsWithCoin) {
    return score;
  }
  return score + 1;
};

import { GameState } from '../../../state';
import { AllCollisions } from '../collisions';

export const updateGameScoreState = (
  { game: { score } }: GameState,
  { characterCollisionsWithCoin }: AllCollisions
): number => {
  if (!characterCollisionsWithCoin) {
    return score;
  }
  return score + 1;
};

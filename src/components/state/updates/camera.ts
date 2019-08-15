import { GameState, Camera, isCharacterPastTheMiddle } from '../../../state';
import { Directions } from '../../../constants';
import { JungleRunnerProps } from '../../../types';

export const updateCameraState = (
  { character, world }: GameState,
  { canvas }: JungleRunnerProps,
  direction: number
): Camera => {
  if (direction === Directions.Left) {
    return {
      vX: 0,
    };
  }

  if (isCharacterPastTheMiddle(canvas, world.character.sprite)) {
    return {
      vX: character.vX,
    };
  }

  const factor =
    Math.round((world.character.sprite.x * 100) / (canvas.width / 1.8)) / 100;

  return {
    vX: character.vX * factor,
  };
};

import { GameState, Camera, isCharacterPastTheMiddle } from '../../../state';
import { Directions } from '../../../constants';
import { JungleRunnerProps } from '../../../types';

export const updateCameraState = (
  { character, world, camera }: GameState,
  { canvas }: JungleRunnerProps,
  direction: number
): Camera => {
  const characterMovesLeft = direction === Directions.Left;
  const mapEnds = camera.x + camera.width >= world.size.width;

  if (characterMovesLeft || mapEnds) {
    return {
      ...camera,
      vX: 0,
    };
  }

  if (isCharacterPastTheMiddle(canvas, world.character.sprite)) {
    return {
      ...camera,
      x: camera.x + character.vX,
      vX: character.vX,
    };
  }

  const factor =
    Math.round((world.character.sprite.x * 100) / (canvas.width / 1.8)) / 100;

  return {
    ...camera,
    x: camera.x + character.vX * factor,
    vX: character.vX * factor,
  };
};

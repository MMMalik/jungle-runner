import { GameState, Camera, isCharacterPastTheMiddle } from '../../../state';
import { Directions } from '../../../constants';
import { JungleRunnerProps } from '../../../types';

export const updateCameraState = (
  { character, world, camera }: GameState,
  { canvas }: JungleRunnerProps,
  direction: number
): Camera => {
  const characterMovesLeft = direction === Directions.Left;
  const mapEnds = camera.x + camera.width >= world.size.width - 2;

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

  const factor = (2 * world.character.sprite.x) / camera.width;

  return {
    ...camera,
    x: camera.x + character.vX * factor,
    vX: character.vX * factor,
  };
};

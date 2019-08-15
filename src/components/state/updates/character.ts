import getKeyboardState from '../keyboard';
import {
  GameState,
  getCharacterRunningDirection,
  shouldCharacterMoveX,
  isJumping,
  isOnTheGround,
  getJumpTicks,
  isOutsideCanvas,
  MovableComponent,
} from '../../../state';
import { ComponentCommonProps } from '../../../framework';
import {
  JungleRunnerGameStages,
  CharacterConst,
  GameConst,
  Directions,
} from '../../../constants';
import { AllCollisions } from '../State';

export const updateCharacterState = (
  { character, sprites }: GameState,
  { characterCollisions: { characterCollisionsWithPlatform } }: AllCollisions,
  { canvas }: ComponentCommonProps<typeof JungleRunnerGameStages>
): MovableComponent => {
  const { Space, ArrowLeft, ArrowRight } = getKeyboardState();
  const direction = getCharacterRunningDirection(ArrowRight, ArrowLeft);
  const movingX = shouldCharacterMoveX(ArrowRight, ArrowLeft);
  const jumping = isJumping(character.jumpTicks);
  const onTheGround = isOnTheGround(characterCollisionsWithPlatform.v);
  const jumpTicks = getJumpTicks(
    onTheGround && Space,
    characterCollisionsWithPlatform.v > 0,
    character.jumpTicks,
    CharacterConst.MaxJumpTicks
  );
  const isRunningOutsideLeftEdge =
    direction === Directions.Left &&
    sprites.character.x - sprites.character.width / 2 < 0;
  const lives = isOutsideCanvas(canvas, sprites.character)
    ? character.lives - 1
    : character.lives;

  return {
    direction: direction || character.direction,
    lives,
    vX: isRunningOutsideLeftEdge
      ? 0
      : direction * CharacterConst.BaseVx + characterCollisionsWithPlatform.h,
    vY: jumping
      ? GameConst.Gravity +
        characterCollisionsWithPlatform.v -
        CharacterConst.BaseJumpHeight
      : GameConst.Gravity + characterCollisionsWithPlatform.v,
    movingX,
    jumping,
    onTheGround,
    jumpTicks,
  };
};

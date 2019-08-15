import { KeyboardState } from '../keyboard';
import {
  GameState,
  shouldCharacterMoveX,
  isJumping,
  isOnTheGround,
  getJumpTicks,
  isOutsideCanvas,
  MovableComponent,
} from '../../../state';
import { CharacterConst, GameConst, Directions } from '../../../constants';
import { AllCollisions } from '../State';
import { JungleRunnerProps } from '../../../types';

export const updateCharacterState = (
  { character, world }: GameState,
  { characterCollisions: { characterCollisionsWithPlatform } }: AllCollisions,
  { canvas }: JungleRunnerProps,
  keyboard: KeyboardState,
  direction: number,
  delta: number
): MovableComponent => {
  const { Space, ArrowLeft, ArrowRight } = keyboard;

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
    world.character.sprite.x - world.character.sprite.width / 2 < 0;

  const lives = isOutsideCanvas(canvas, world.character.sprite)
    ? character.lives - 1
    : character.lives;

  const vX = isRunningOutsideLeftEdge
    ? 0
    : direction * CharacterConst.BaseVx + characterCollisionsWithPlatform.h;

  const vY = jumping
    ? GameConst.Gravity +
      characterCollisionsWithPlatform.v -
      CharacterConst.BaseJumpHeight
    : GameConst.Gravity + characterCollisionsWithPlatform.v;

  return {
    direction: direction || character.direction,
    lives,
    vX: vX * delta,
    vY: vY * delta,
    movingX,
    jumping,
    onTheGround,
    jumpTicks,
  };
};

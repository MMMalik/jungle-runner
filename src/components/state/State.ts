import * as PIXI from 'pixi.js';
import { GameComponent, ComponentCommonProps, Render } from '../component';
import {
  GameState,
  isJumping,
  getJumpTicks,
  shouldCharacterMoveX,
  getCharacterRunningDirection,
} from '../../state';
import calculateCollisions from './collisions';
import { CharacterConst, Directions, GameConst } from '../../constants';
import getKeyboardState from './keyboard';

const getCharacterState = (state: GameState) => {
  const { Space, ArrowLeft, ArrowRight } = getKeyboardState();
  const direction = getCharacterRunningDirection(ArrowRight, ArrowLeft);
  const movingX = shouldCharacterMoveX(ArrowRight, ArrowLeft);
  const { jumpTicks } = state.character;
  const jumping = isJumping(jumpTicks);
  const { characterCollisionsWithPlatform } = calculateCollisions({
    state,
    directedVx: CharacterConst.BaseVx * direction,
  });
  const onTheGround = Math.abs(characterCollisionsWithPlatform.v) !== 0;

  return {
    direction: direction || Directions.Right,
    vX: direction * CharacterConst.BaseVx + characterCollisionsWithPlatform.h,
    vY: GameConst.Gravity + characterCollisionsWithPlatform.v,
    movingX,
    jumping,
    onTheGround,
    jumpTicks: getJumpTicks(
      onTheGround && Space,
      jumpTicks,
      CharacterConst.MaxJumpTicks
    ),
  };
};

export const render: Render<GameState, {}> = ({ state }) => {
  state.character = getCharacterState(state);
};

const State: GameComponent<
  ComponentCommonProps,
  PIXI.Sprite,
  GameState
> = () => {
  return { render };
};

export default State;

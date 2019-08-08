import * as PIXI from 'pixi.js';
import level1 from '../../assets/levels/level1.json';
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
import { createLevel } from './level';

const getCharacterState = (state: GameState) => {
  const { Space, ArrowLeft, ArrowRight } = getKeyboardState();
  const direction = getCharacterRunningDirection(ArrowRight, ArrowLeft);
  const movingX = shouldCharacterMoveX(ArrowRight, ArrowLeft);
  const { jumpTicks, score } = state.character;
  const jumping = isJumping(jumpTicks);
  const {
    characterCollisionsWithPlatform,
    characterCollisionsWithCoin,
  } = calculateCollisions({
    state,
    directedVx: CharacterConst.BaseVx * direction,
    directedVy: jumping
      ? GameConst.Gravity - CharacterConst.BaseJumpHeight
      : GameConst.Gravity,
  });
  const onTheGround = Math.abs(characterCollisionsWithPlatform.v) !== 0;

  if (characterCollisionsWithCoin) {
    characterCollisionsWithCoin.sprite.parent.removeChild(
      characterCollisionsWithCoin.sprite
    );
    state.sprites.coins = state.sprites.coins.filter(
      coin => coin.tile.uid !== characterCollisionsWithCoin.tile.uid
    );
  }

  if (characterCollisionsWithPlatform.v > 0) {
    state.character.jumpTicks = 0;
  }

  return {
    direction: direction || Directions.Right,
    score: characterCollisionsWithCoin ? score + 1 : score,
    vX: direction * CharacterConst.BaseVx + characterCollisionsWithPlatform.h,
    vY: jumping
      ? GameConst.Gravity +
        characterCollisionsWithPlatform.v -
        CharacterConst.BaseJumpHeight
      : GameConst.Gravity + characterCollisionsWithPlatform.v,
    movingX,
    jumping,
    onTheGround,
    jumpTicks: getJumpTicks(
      onTheGround && Space,
      characterCollisionsWithPlatform.v > 0,
      jumpTicks,
      CharacterConst.MaxJumpTicks
    ),
  };
};

export const render: Render<GameState, {}> = ({ state }) => {
  state.character = getCharacterState(state);
};

const State: GameComponent<ComponentCommonProps, PIXI.Sprite, GameState> = (
  _,
  state
) => {
  state.level = createLevel(level1);
  return { render };
};

export default State;

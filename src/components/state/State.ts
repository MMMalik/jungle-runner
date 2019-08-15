import * as PIXI from 'pixi.js';
import {
  GameState,
  isJumping,
  getCharacterRunningDirection,
} from '../../state';
import {
  calculateCharacterCollisions,
  CharacterCollisions,
} from './collisions';
import { CharacterConst, GameConst } from '../../constants';
import { JungleRunnerGameComponent, JungleRunnerRender } from '../../types';
import {
  updateCharacterState,
  updateCoinsState,
  updateCameraState,
  updateGameScoreState,
} from './updates';
import getKeyboardState from './keyboard';

export interface AllCollisions {
  characterCollisions: CharacterCollisions;
}

const predictedCharacterVx = ({ character }: GameState, direction: number) =>
  CharacterConst.BaseVx * direction;

const predictedCharacterVy = ({ character }: GameState) =>
  isJumping(character.jumpTicks)
    ? GameConst.Gravity - CharacterConst.BaseJumpHeight
    : GameConst.Gravity;

export const getCollisions = (
  state: GameState,
  direction: number
): AllCollisions => {
  return {
    characterCollisions: calculateCharacterCollisions({
      world: state.world,
      directedVx: predictedCharacterVx(state, direction),
      directedVy: predictedCharacterVy(state),
    }),
  };
};

export const render: JungleRunnerRender<PIXI.Sprite> = ({
  state,
  delta,
  initProps,
}) => {
  const keyboard = getKeyboardState();
  const direction = getCharacterRunningDirection(
    keyboard.ArrowRight,
    keyboard.ArrowLeft
  );
  const collisions = getCollisions(state, direction);
  state.game.score = updateGameScoreState(state, collisions);
  state.world.coins = updateCoinsState(state, collisions);
  state.character = updateCharacterState(
    state,
    collisions,
    initProps,
    keyboard,
    direction,
    delta
  );
  state.camera = updateCameraState(state, initProps, direction);
  state.world.character = {
    ...state.world.character,
    x: state.world.character.x + state.character.vX,
    y: state.world.character.y + state.character.vY,
  };
};

const State: JungleRunnerGameComponent<PIXI.Sprite> = () => {
  return { render, elements: [] };
};

export default State;

import * as PIXI from 'pixi.js';
import {
  GameState,
  isJumping,
  getCharacterRunningDirection,
} from '../../state';
import { calculateCollisions, AllCollisions } from './collisions';
import {
  CharacterConst,
  GameConst,
  JungleRunnerGameStages,
} from '../../constants';
import { JungleRunnerGameComponent, JungleRunnerRender } from '../../types';
import {
  updateCharacterState,
  updateCoinsState,
  updateCameraState,
  updateGameScoreState,
  updateTotems,
  updateWasps,
} from './updates';
import getKeyboardState from './keyboard';

const predictedCharacterVx = ({ character }: GameState, direction: number) =>
  CharacterConst.BaseVx * direction;

const predictedCharacterVy = ({ character }: GameState) =>
  isJumping(character.jumpTicks)
    ? GameConst.Gravity - CharacterConst.BaseJumpHeight
    : GameConst.Gravity;

export const getCollisions = (
  state: GameState,
  direction: number,
  delta: number
): AllCollisions => {
  return calculateCollisions({
    world: state.world,
    directedVx: predictedCharacterVx(state, direction),
    directedVy: predictedCharacterVy(state),
  });
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
  const collisions = getCollisions(state, direction, delta);
  state.game.score = updateGameScoreState(state, collisions);
  state.world.coins = updateCoinsState(state, collisions);
  state.character = updateCharacterState(
    state,
    collisions,
    keyboard,
    direction,
    delta
  );
  state.world.enemies.totems = updateTotems(state, collisions);
  state.world.enemies.wasps = updateWasps(state, collisions);
  state.camera = updateCameraState(state, initProps, direction);
  state.world.character = {
    ...state.world.character,
    x: state.world.character.x + state.character.vX,
    y: state.world.character.y + state.character.vY,
  };

  if (state.world.character.x >= state.world.size.width) {
    state.game.level.num += 1;
    if (state.game.level.num > GameConst.Levels) {
      initProps.nextStage(JungleRunnerGameStages.FinalScreen);
    } else {
      state.camera = {
        vX: 0,
        x: 0,
        y: 0,
        width: initProps.canvas.width,
        height: initProps.canvas.height,
      };
      initProps.nextStage(JungleRunnerGameStages.LoadAssets);
    }
  }
};

const State: JungleRunnerGameComponent<PIXI.Sprite> = () => {
  return { render, elements: [] };
};

export default State;

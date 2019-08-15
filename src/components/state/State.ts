import * as PIXI from 'pixi.js';
import { GameState, isJumping } from '../../state';
import {
  calculateCharacterCollisions,
  CharacterCollisions,
} from './collisions';
import {
  CharacterConst,
  GameConst,
  JungleRunnerGameStages,
} from '../../constants';
import { JungleRunnerGameComponent, JungleRunnerRender } from '../../types';
import { updateCharacterState, updateCoinsState } from './updates';
import { updateGameScoreState } from './updates/score';

export interface AllCollisions {
  characterCollisions: CharacterCollisions;
}

export const getCollisions = ({
  sprites,
  character,
}: GameState): AllCollisions => {
  return {
    characterCollisions: calculateCharacterCollisions({
      sprites,
      directedVx: CharacterConst.BaseVx * character.direction,
      directedVy: isJumping(character.jumpTicks)
        ? GameConst.Gravity - CharacterConst.BaseJumpHeight
        : GameConst.Gravity,
    }),
  };
};

export const render: JungleRunnerRender<PIXI.Sprite> = ({
  state,
  initProps,
}) => {
  const collisions = getCollisions(state);
  state.game.score = updateGameScoreState(state, collisions);
  state.sprites.coins = updateCoinsState(state, collisions);
  state.character = updateCharacterState(state, collisions, initProps);
};

const State: JungleRunnerGameComponent<PIXI.Sprite> = () => {
  return { render, elements: [] };
};

export default State;

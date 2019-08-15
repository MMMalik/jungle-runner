import { Render, ComponentCommonProps, GameComponent } from '../framework';
import { JungleRunnerGameStages } from '../constants';
import { GameState } from '../state';

export type JungleRunnerRender<T> = Render<
  GameState,
  T,
  ComponentCommonProps<typeof JungleRunnerGameStages>
>;

export type JungleRunnerGameComponent<T> = GameComponent<
  ComponentCommonProps<typeof JungleRunnerGameStages>,
  T,
  GameState
>;

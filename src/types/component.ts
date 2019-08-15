import { Render, ComponentCommonProps, GameComponent } from '../framework';
import { JungleRunnerGameStages } from '../constants';
import { GameState } from '../state';

export type JungleRunnerProps = ComponentCommonProps<
  typeof JungleRunnerGameStages
>;

export type JungleRunnerRender<T> = Render<GameState, T, JungleRunnerProps>;

export type JungleRunnerGameComponent<T> = GameComponent<
  JungleRunnerProps,
  T,
  GameState
>;

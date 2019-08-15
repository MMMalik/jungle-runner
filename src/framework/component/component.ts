import { NextStageFn } from '../levels';

export type Render<GameState, E, Props> = (renderProps: {
  initProps: Props;
  state: GameState;
  delta: number;
  elements: E[];
}) => void;

export interface GameElement<E, GameState, Props> {
  debug?: (container: PIXI.Container) => () => void;
  render: Render<GameState, E, Props>;
  elements: E[];
}

export type GameComponent<Props, E, GameState> = (
  props: Props,
  state: GameState
) => GameElement<E, GameState, Props>;

export interface ComponentCommonProps<GameStages> {
  canvas: HTMLCanvasElement;
  container: PIXI.Container;
  nextStage: NextStageFn<GameStages>;
}

export type CreateComponent = <Props, E extends PIXI.DisplayObject, GameState>(
  Component: GameComponent<Props, E, GameState>,
  props: Props,
  state: GameState
) => GameElement<E, GameState, Props>;

export type CleanupFn = () => void;

export type InitComponents = <GameState, GameStages>(
  app: PIXI.Application,
  props: ComponentCommonProps<GameStages>,
  state: GameState,
  components: Array<
    GameComponent<
      ComponentCommonProps<GameStages>,
      PIXI.DisplayObject,
      GameState
    >
  >
) => CleanupFn;

export const createComponent: CreateComponent = (Component, props, state) =>
  Component(props, state);

export const initComponents: InitComponents = (
  app,
  props,
  state,
  components
) => {
  const created = components.map(Component =>
    createComponent(Component, props, state)
  );

  const tickers = created.map(({ render, elements }) => {
    return (delta: number) => {
      render({
        delta,
        initProps: props,
        state,
        elements,
      });
    };
  });

  created.forEach(({ elements }) => {
    elements.forEach(el => {
      props.container.addChild(el);
    });
  });

  tickers.forEach(ticker => {
    app.ticker.add(ticker);
  });

  return () => {
    app.stage.removeChild(props.container);
    tickers.forEach(t => {
      app.ticker.remove(t);
    });
  };
};

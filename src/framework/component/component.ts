import { NextStageFn } from '../levels';

export type Render<GameState, E, Props> = (renderProps: {
  initProps: Props;
  state: GameState;
  delta: number;
  elements: E[];
}) => void;

export interface GameElement<E, GameState, Props> {
  debug?: (container: PIXI.Container) => () => void;
  isFixed?: boolean;
  isFollowed?: boolean;
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

export type GameComponents<GameState, GameStages> = Array<
  GameComponent<ComponentCommonProps<GameStages>, PIXI.DisplayObject, GameState>
>;

export type GameElements<GameState, GameStages> = Array<
  GameElement<PIXI.DisplayObject, GameState, ComponentCommonProps<GameStages>>
>;

export type InitComponents = <GameState, GameStages>(
  app: PIXI.Application,
  props: ComponentCommonProps<GameStages>,
  state: GameState,
  components: GameComponents<GameState, GameStages>,
  cameraUpdateFn: (
    state: GameState,
    components: GameElements<GameState, GameStages>
  ) => () => void
) => CleanupFn;

type ExtendedDisplayObject = PIXI.DisplayObject & {
  __isFixed__?: boolean;
  __isFollowed__?: boolean;
};

export const createComponent: CreateComponent = (Component, props, state) =>
  Component(props, state);

export const initComponents: InitComponents = (
  app,
  props,
  state,
  components,
  cameraUpdateFn
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

  created.forEach(({ elements, debug, isFixed, isFollowed }) => {
    elements.forEach((el: ExtendedDisplayObject) => {
      el.__isFixed__ = isFixed;
      el.__isFollowed__ = isFollowed;
      props.container.addChild(el);
    });
    if (debug) {
      const fn = debug(props.container);
      app.ticker.add(fn);
    }
  });

  tickers.forEach(ticker => {
    app.ticker.add(ticker);
  });

  app.ticker.add(cameraUpdateFn(state, created));

  return () => {
    app.stage.removeChild(props.container);
    tickers.forEach(t => {
      app.ticker.remove(t);
    });
  };
};

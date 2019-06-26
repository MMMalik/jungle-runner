interface Element<E> {
  element: E;
  elements: E[];
}

export type Render<GameState, E> = (
  renderProps: {
    initProps: ComponentCommonProps;
    state: GameState;
    delta: number;
  } & E
) => void;

export interface GameElement<E, GameState> {
  render?: Render<GameState, Element<E>>;
  element?: E;
  elements?: E[];
}

export type GameComponent<Props, E, GameState> = (
  props: Props,
  state: GameState
) => GameElement<E, GameState>;

export interface ComponentCommonProps {
  canvas: HTMLCanvasElement;
  container: PIXI.Container;
}

export type CreateComponent = <Props, E extends PIXI.Sprite, GameState>(
  Component: GameComponent<Props, E, GameState>,
  props: Props,
  state: GameState
) => GameElement<E, GameState>;

const createComponent: CreateComponent = (Component, props, state) =>
  Component(props, state);

export default createComponent;

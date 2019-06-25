import { GameState } from '../../state';

export type Ticker = () => void;

export interface GameElement<P extends PIXI.Sprite> {
  ticker?: Ticker;
  update?: Ticker;
  render?: Ticker;
  element?: P | P[];
}

export type GameComponent<Props, P extends PIXI.Sprite> = (
  props: Props
) => GameElement<P>;

export interface ComponentCommonProps {
  canvas: HTMLCanvasElement;
  state: GameState;
  container: PIXI.Container;
}

export type CreateComponent = <Props, P extends PIXI.Sprite>(
  Component: GameComponent<Props, P>,
  props: Props
) => GameElement<P>;

const createComponent: CreateComponent = (Component, props) => Component(props);

export default createComponent;

import * as PIXI from 'pixi.js';
import { GameComponent, ComponentCommonProps, Render } from '../component';
import { GameState } from '../../state';

export const render: Render<GameState, { element: PIXI.Text }> = ({
  state,
  element,
}) => {
  element.text = `Score: ${state.character.score}`;
};

const Score: GameComponent<ComponentCommonProps, PIXI.Text, GameState> = (
  _,
  state
) => {
  const text = new PIXI.Text(`Score: ${state.character.score}`, {
    fill: '#fff',
  });

  text.anchor.x = 0.5;
  text.anchor.y = 0.5;
  text.position.x = 65;
  text.position.y = 25;

  return {
    render,
    element: text,
  };
};

export default Score;

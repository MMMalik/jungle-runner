import * as PIXI from 'pixi.js';
import { JungleRunnerRender, JungleRunnerGameComponent } from '../../types';

export const render: JungleRunnerRender<PIXI.Text> = ({ state, elements }) => {
  elements.forEach(element => {
    element.text = `Score: ${state.game.score}`;
  });
};

const Score: JungleRunnerGameComponent<PIXI.Text> = (_, state) => {
  const text = new PIXI.Text(`Score: ${state.game.score}`, {
    fontFamily: 'EquipmentPro',
    fill: '#FFE919',
  });

  text.anchor.x = 0.5;
  text.anchor.y = 0.5;
  text.position.x = 65;
  text.position.y = 25;

  return {
    render,
    elements: [text],
  };
};

export default Score;

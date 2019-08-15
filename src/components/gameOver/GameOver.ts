import * as PIXI from 'pixi.js';
import { noop } from '../../framework';
import { JungleRunnerGameComponent } from '../../types';

const render = noop;

const GameOver: JungleRunnerGameComponent<PIXI.Text> = ({ canvas }) => {
  const text = new PIXI.Text(`Game Over!`, {
    fontFamily: 'EquipmentPro',
    fill: '#fff',
  });

  text.anchor.x = 0.5;
  text.anchor.y = 0.5;
  text.position.x = canvas.width / 2;
  text.position.y = canvas.height / 2;

  return {
    render,
    elements: [text],
  };
};

export default GameOver;

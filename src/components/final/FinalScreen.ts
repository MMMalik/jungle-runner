import * as PIXI from 'pixi.js';
import { noop } from '../../framework';
import { JungleRunnerGameComponent } from '../../types';

export const render = noop;

const FinalScreen: JungleRunnerGameComponent<PIXI.Text> = (
  { canvas },
  state
) => {
  const text = new PIXI.Text(
    `Congratulations!\n\nYour score is: ${state.game.score}`,
    {
      fontFamily: 'EquipmentPro',
      fill: '#fff',
    }
  );

  text.anchor.x = 0.5;
  text.anchor.y = 0.5;
  text.position.x = canvas.width / 2;
  text.position.y = canvas.height / 2;

  return {
    render,
    elements: [text],
  };
};

export default FinalScreen;

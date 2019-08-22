import * as PIXI from 'pixi.js';
import { noop } from '../../framework';
import { JungleRunnerGameComponent } from '../../types';

const PlainBackground: JungleRunnerGameComponent<PIXI.Sprite> = ({
  canvas,
}) => {
  const bg = new PIXI.Sprite(PIXI.Texture.WHITE);

  bg.width = canvas.width;
  bg.height = canvas.height;
  bg.x = 0;
  bg.y = 0;
  bg.tint = 0x4a4f4a;

  return {
    render: noop,
    elements: [bg],
  };
};

export default PlainBackground;

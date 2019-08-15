import * as PIXI from 'pixi.js';
import initState from '../../state';
import { noop } from '../../framework';

describe('Coins', () => {
  let state = initState();

  const initProps = {
    canvas: document.createElement('canvas'),
    container: new PIXI.Container(),
    cameraUpdateFn: () => noop,
    nextStage: noop,
  };

  beforeEach(() => {
    state = initState();
  });

  it.skip('renders sprite in position', () => {
    const elements = [new PIXI.Sprite()];
    // render({
    //   initProps,
    //   state,
    //   delta: 1,
    //   elements,
    // });
    elements.forEach(sprite => {
      expect(sprite.x).toEqual(0);
    });
  });
});

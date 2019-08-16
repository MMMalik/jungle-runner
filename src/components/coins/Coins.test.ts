import * as PIXI from 'pixi.js';
import initState from '../../state';
import { noop } from '../../framework';

describe('Coins', () => {
  let state = initState({
    camera: {
      vX: 0,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
  });

  const initProps = {
    canvas: document.createElement('canvas'),
    container: new PIXI.Container(),
    cameraUpdateFn: () => noop,
    nextStage: noop,
  };

  beforeEach(() => {
    state = initState({
      camera: {
        vX: 0,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    });
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

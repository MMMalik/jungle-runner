import * as PIXI from 'pixi.js';
import { render } from './Coins';
import initState from '../../state';
import { noop } from '../../framework';

describe('Coins', () => {
  let state = initState();

  const initProps = {
    canvas: document.createElement('canvas'),
    container: new PIXI.Container(),
    nextStage: noop,
  };

  beforeEach(() => {
    state = initState();
  });

  it('renders sprite in position', () => {
    const elements = [new PIXI.Sprite()];
    render({
      initProps,
      state,
      delta: 1,
      elements,
    });
    elements.forEach(sprite => {
      expect(sprite.x).toEqual(0);
    });
  });
});

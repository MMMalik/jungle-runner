import * as PIXI from 'pixi.js';
import initState from '../../state';
import { noop } from '../../framework';

const mockSprites = () => [new PIXI.TilingSprite(PIXI.Texture.from('test'))];

describe('Platform', () => {
  let state = initState({
    camera: {
      vX: 0,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
  });
  let sprites = mockSprites();

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
    sprites = mockSprites();
  });

  it.skip('renders without modifying tile position', () => {
    // render({
    //   initProps,
    //   state,
    //   delta: 1,
    //   elements: sprites,
    // });
    sprites.forEach(sprite => expect(sprite.x).toEqual(0));
  });

  it.skip('renders if character moves', () => {
    state.character.vX = 3;
    // render({
    //   initProps,
    //   state,
    //   delta: 1,
    //   elements: sprites,
    // });
    sprites.forEach(sprite => expect(sprite.x).toEqual(-state.character.vX));
  });
});

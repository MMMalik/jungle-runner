import * as PIXI from 'pixi.js';
import initState from '../../state';
import { noop } from '../../framework';

const mockSprites = () => [new PIXI.TilingSprite(PIXI.Texture.from('test'))];

describe('Platform', () => {
  let state = initState();
  let sprites = mockSprites();

  const initProps = {
    canvas: document.createElement('canvas'),
    container: new PIXI.Container(),
    cameraUpdateFn: () => noop,
    nextStage: noop,
  };

  beforeEach(() => {
    state = initState();
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

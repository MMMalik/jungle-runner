import * as PIXI from 'pixi.js';
import { render } from './Platform';
import initState from '../../state';

const mockSprites = () => [new PIXI.TilingSprite(PIXI.Texture.from('test'))];

describe('Platform', () => {
  let state = initState();
  let sprites = mockSprites();

  const initProps = {
    canvas: document.createElement('canvas'),
    container: new PIXI.Container(),
  };

  beforeEach(() => {
    state = initState();
    sprites = mockSprites();
  });

  it('renders without modifying tile position', () => {
    render({
      initProps,
      state,
      delta: 1,
      elements: sprites,
    });
    sprites.forEach(sprite => expect(sprite.x).toEqual(0));
  });

  it('renders if character moves', () => {
    state.character.vX = 3;
    render({
      initProps,
      state,
      delta: 1,
      elements: sprites,
    });
    sprites.forEach(sprite => expect(sprite.x).toEqual(-state.character.vX));
  });
});

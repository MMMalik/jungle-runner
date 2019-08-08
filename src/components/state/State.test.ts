import * as PIXI from 'pixi.js';
import { render } from './State';
import initState from '../../state';

describe('State', () => {
  let state = initState();
  const initProps = {
    canvas: document.createElement('canvas'),
    container: new PIXI.Container(),
  };

  beforeEach(() => {
    const tile = {
      tileWidth: 16,
      tileHeight: 16,
      tileId: 100,
      x: 160,
      y: 160,
      hasNeighborLeft: true,
      hasNeighborRight: true,
      hasNeighborDown: true,
      hasNeighborUp: false,
    };
    state = initState();
    state.sprites.character = new PIXI.Sprite();
    state.sprites.platform = [{ sprite: new PIXI.Sprite(), tile }];
  });

  describe('render', () => {
    it('updates character state', () => {
      render({
        initProps,
        state,
        delta: 1,
      });
      expect(state.character.vX).toEqual(state.character.vX);
    });
  });
});

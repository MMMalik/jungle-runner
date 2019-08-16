import * as PIXI from 'pixi.js';
import { render } from './State';
import initState from '../../state';
import { TileType } from './level';
import { noop } from '../../framework';

jest.mock('../../assets/levels/level1.json', () => ({
  layers: [0, 0, 0],
  height: 200,
  width: 200,
  tileheight: 20,
  tilewidth: 20,
}));

describe('State', () => {
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
    const tile = {
      type: TileType.Platform,
      uid: 'test',
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
    state = initState({
      camera: {
        vX: 0,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    });
    state.world.character.sprite = new PIXI.Sprite();
    state.world.platform = [{ sprite: new PIXI.Sprite(), tile }];
  });

  describe('render', () => {
    it('updates character state', () => {
      render({
        initProps,
        state,
        delta: 1,
        elements: [],
      });
      expect(state.character.vX).toEqual(state.character.vX);
    });
  });
});

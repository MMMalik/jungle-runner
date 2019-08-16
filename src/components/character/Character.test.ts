import * as PIXI from 'pixi.js';
import { render, initCharacterSprite, getInitPosition } from './Character';
import initState from '../../state';
import { noop } from '../../framework';
import { TileType } from '../state/level';

const mockResource = (name: string) => {
  // @ts-ignore
  const resource = new PIXI.LoaderResource(name, name);
  resource.spritesheet = {
    animations: { [name]: [PIXI.Texture.from(name)] },
  };
  return resource;
};

const mockedResources = {
  Idle: () => mockResource('idle'),
  Running: () => mockResource('run'),
  Jumping: () => mockResource('jump'),
  Landing: () => mockResource('landing'),
};

const mockSprite = () => {
  const sprite = new PIXI.AnimatedSprite(
    mockedResources.Idle().spritesheet.animations.idle
  );
  initCharacterSprite(sprite, {
    tileHeight: 100,
    tileId: 1,
    tileWidth: 100,
    x: 0,
    y: 0,
    uid: '111',
    type: TileType.Character,
  });
  return sprite;
};

describe('Character - render', () => {
  const initProps = {
    canvas: (() => {
      const element = document.createElement('canvas');
      element.width = 1000;
      element.height = 500;
      return element;
    })(),
    cameraUpdateFn: () => noop,
    nextStage: noop,
    container: new PIXI.Container(),
  };
  let state = initState({
    camera: {
      vX: 0,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
  });
  let initPos = getInitPosition(initProps.canvas);
  let sprite = mockSprite();

  beforeEach(() => {
    initPos = getInitPosition(initProps.canvas);
    state = initState({
      camera: {
        vX: 0,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    });
    sprite = mockSprite();
  });

  describe('init', () => {
    it.skip('renders correctly on the initial render', () => {
      render(mockedResources)({
        initProps,
        state,
        delta: 1,
        elements: [sprite],
      });
      expect(sprite.x).toEqual(initPos.x + state.character.vX);
      expect(sprite.y).toEqual(initPos.y + state.character.vY);
    });
  });
});

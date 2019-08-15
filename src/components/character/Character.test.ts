import * as PIXI from 'pixi.js';
import { render, initCharacterSprite, getInitPosition } from './Character';
import initState from '../../state';
import { noop } from '../../framework';

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

const mockSprite = (canvas: HTMLCanvasElement) => {
  const sprite = new PIXI.AnimatedSprite(
    mockedResources.Idle().spritesheet.animations.idle
  );
  initCharacterSprite(canvas, sprite);
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
    nextStage: noop,
    container: new PIXI.Container(),
  };
  let state = initState();
  let initPos = getInitPosition(initProps.canvas);
  let sprite = mockSprite(initProps.canvas);

  beforeEach(() => {
    initPos = getInitPosition(initProps.canvas);
    state = initState();
    sprite = mockSprite(initProps.canvas);
  });

  describe('init', () => {
    it('renders correctly on the initial render', () => {
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

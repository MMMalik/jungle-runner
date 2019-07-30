import * as PIXI from 'pixi.js';
import { render, initCharacterSprite, getInitPosition } from './Character';
import initState from '../../state';
import { CharacterConst, Directions, GameConst } from '../../constants';

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
        element: sprite,
      });
      expect(sprite.x).toEqual(initPos.x);
      expect(sprite.y).toEqual(initPos.y + GameConst.Gravity);
    });
  });

  describe('run', () => {
    it('renders correctly if arrow left is pressed', () => {
      state.keyboard.ArrowLeft = true;
      state.character.collisions.platformV = -4;
      render(mockedResources)({
        initProps,
        state,
        delta: 1,
        element: sprite,
      });
      expect(sprite.x).toEqual(initPos.x);
      expect(sprite.y).toEqual(initPos.y);
      expect(state.character.vX).toEqual(
        CharacterConst.BaseVx * Directions.Left
      );
      expect(sprite.playing).toBe(true);
      expect(sprite.textures[0].baseTexture.cacheId).toEqual('run');
    });

    it('renders correctly if arrow right is pressed', () => {
      state.keyboard.ArrowRight = true;
      state.character.collisions.platformV = -4;
      render(mockedResources)({
        initProps,
        state,
        delta: 1,
        element: sprite,
      });
      expect(sprite.x).toEqual(initPos.x);
      expect(sprite.y).toEqual(initPos.y);
      expect(state.character.vX).toEqual(
        CharacterConst.BaseVx * Directions.Right
      );
      expect(sprite.playing).toBe(true);
      expect(sprite.textures[0].baseTexture.cacheId).toEqual('run');
    });
  });

  describe('jump', () => {
    it('renders correctly if space is pressed', () => {
      state.keyboard.Space = true;
      state.character.collisions.platformV = -4;
      render(mockedResources)({
        initProps,
        state,
        delta: 1,
        element: sprite,
      });
      expect(sprite.x).toEqual(initPos.x);
      expect(sprite.y).toEqual(initPos.y);
      expect(state.character.jumpTicks).toEqual(1);
      expect(sprite.playing).toBe(true);
      expect(sprite.textures[0].baseTexture.cacheId).toEqual('idle');

      state.character.collisions.platformV = 0;

      Array.from({ length: CharacterConst.MaxJumpTicks }).map((_, i) => {
        render(mockedResources)({
          initProps,
          state,
          delta: 1,
          element: sprite,
        });
        expect(sprite.x).toEqual(initPos.x);
        expect(sprite.y).toEqual(
          initPos.y -
            (i + 1) * (CharacterConst.BaseJumpHeight - GameConst.Gravity)
        );
        expect(state.character.jumpTicks).toEqual(i + 2);
        expect(sprite.playing).toBe(true);
        expect(sprite.textures[0].baseTexture.cacheId).toEqual('jump');
      });
    });

    it('renders correctly if landing', () => {
      sprite.y = 0;
      render(mockedResources)({
        initProps,
        state,
        delta: 1,
        element: sprite,
      });
      expect(sprite.playing).toBe(true);
      expect(sprite.y).toEqual(GameConst.Gravity);
      expect(sprite.textures[0].baseTexture.cacheId).toEqual('landing');
    });
  });

  describe.skip('collisions', () => {
    it('ignores gravity if collides bottom with platform', () => {
      state.character.collisions.platformV = -4;
      render(mockedResources)({
        initProps,
        state,
        delta: 1,
        element: sprite,
      });
      expect(sprite.x).toEqual(initPos.x);
      expect(sprite.y).toEqual(initPos.y);
    });

    it('respects collision with platform - right', () => {
      state.character.collisions.platformV = -4;
      state.character.collisions.platformH = -2;
      state.keyboard.ArrowRight = true;
      render(mockedResources)({
        initProps,
        state,
        delta: 1,
        element: sprite,
      });
      expect(state.character.vX).toEqual(0);
      expect(sprite.y).toEqual(initPos.y);
    });

    it('respects collision with platform - right - let run left regardless', () => {
      state.character.collisions.platformV = -4;
      state.character.collisions.platformH = -2;
      state.keyboard.ArrowLeft = true;

      render(mockedResources)({
        initProps,
        state,
        delta: 1,
        element: sprite,
      });
      expect(state.character.vX).toEqual(CharacterConst.BaseVx * Directions.Left);
      expect(sprite.y).toEqual(initPos.y);
    });

    it('respects collision with platform - left', () => {
      state.character.collisions.platformV = -4;
      state.character.collisions.platformH = 2;
      state.keyboard.ArrowLeft = true;

      render(mockedResources)({
        initProps,
        state,
        delta: 1,
        element: sprite,
      });
      expect(state.character.vX).toEqual(0);
      expect(sprite.y).toEqual(initPos.y);
    });

    it('respects collision with platform - left - let run right regardless', () => {
      state.character.collisions.platformV = -4;
      state.character.collisions.platformH = 4;
      state.keyboard.ArrowRight = true;
      
      render(mockedResources)({
        initProps,
        state,
        delta: 1,
        element: sprite,
      });
      expect(state.character.vX).toEqual(CharacterConst.BaseVx * Directions.Right);
      expect(sprite.y).toEqual(initPos.y);
    });
  });
});

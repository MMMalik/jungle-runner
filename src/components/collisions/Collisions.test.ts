import * as PIXI from 'pixi.js';
import { render, collidesWithPlatform } from './Collisions';
import initState from '../../state';

describe.skip('Collisions', () => {
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

  describe('collidesWithPlatform', () => {
    it('does not detect collision of platform with character if there is none', () => {
      state.sprites.character.x = 0;
      state.sprites.character.y = 0;
      state.sprites.character.width = 21;
      state.sprites.character.height = 33;
      state.sprites.platform[0].sprite.x = 100;
      state.sprites.platform[0].sprite.y = 100;
      state.sprites.platform[0].sprite.width = 16;
      state.sprites.platform[0].sprite.height = 16;

      expect(
        collidesWithPlatform(state.sprites.character, state.sprites.platform)
      ).toEqual({ up: false, bottom: false, left: false, right: false });
    });

    it('detects collision of platform with character - bottom', () => {
      state.sprites.character.x = 0;
      state.sprites.character.y = 0;
      state.sprites.character.width = 21;
      state.sprites.character.height = 33;
      state.sprites.platform[0].sprite.x = 0;
      state.sprites.platform[0].sprite.y = 34;
      state.sprites.platform[0].sprite.width = 16;
      state.sprites.platform[0].sprite.height = 16;

      expect(
        collidesWithPlatform(state.sprites.character, state.sprites.platform)
      ).toEqual({ up: false, bottom: true, left: false, right: false });
    });

    it('detects collision of platform with character - up', () => {
      state.sprites.character.x = 0;
      state.sprites.character.y = 17;
      state.sprites.character.width = 21;
      state.sprites.character.height = 33;
      state.sprites.platform[0].sprite.x = 0;
      state.sprites.platform[0].sprite.y = 0;
      state.sprites.platform[0].sprite.width = 16;
      state.sprites.platform[0].sprite.height = 16;

      expect(
        collidesWithPlatform(state.sprites.character, state.sprites.platform)
      ).toEqual({ up: true, bottom: false, left: false, right: false });
    });

    it('detects collision of platform with character - right', () => {
      state.sprites.character.x = 0;
      state.sprites.character.y = 0;
      state.sprites.character.width = 21;
      state.sprites.character.height = 33;
      state.sprites.platform[0].sprite.x = 22;
      state.sprites.platform[0].sprite.y = 0;
      state.sprites.platform[0].sprite.width = 16;
      state.sprites.platform[0].sprite.height = 16;

      expect(
        collidesWithPlatform(state.sprites.character, state.sprites.platform)
      ).toEqual({ up: false, bottom: false, left: false, right: true });
    });

    it('detects collision of platform with character - left', () => {
      state.sprites.character.x = 17;
      state.sprites.character.y = 0;
      state.sprites.character.width = 21;
      state.sprites.character.height = 33;
      state.sprites.platform[0].sprite.x = 0;
      state.sprites.platform[0].sprite.y = 0;
      state.sprites.platform[0].sprite.width = 16;
      state.sprites.platform[0].sprite.height = 16;

      expect(
        collidesWithPlatform(state.sprites.character, state.sprites.platform)
      ).toEqual({ up: false, bottom: false, left: true, right: false });
    });
  });

  describe('render', () => {
    it('checks if collides and modifies state - no collision', () => {
      state.sprites.character.x = 0;
      state.sprites.character.y = 0;
      state.sprites.character.width = 21;
      state.sprites.character.height = 33;
      state.sprites.platform[0].sprite.x = 100;
      state.sprites.platform[0].sprite.y = 100;
      state.sprites.platform[0].sprite.width = 16;
      state.sprites.platform[0].sprite.height = 16;

      render({
        initProps,
        state,
        delta: 1,
      });

      expect(state.character.collisions).toEqual({
        platformLeft: false,
        platformUp: false,
        platformRight: false,
        platformBottom: false,
      });
    });

    it('checks if collides and modifies state - bottom collision', () => {
      state.sprites.character.x = 0;
      state.sprites.character.y = 0;
      state.sprites.character.width = 21;
      state.sprites.character.height = 33;
      state.sprites.platform[0].sprite.x = 0;
      state.sprites.platform[0].sprite.y = 34;
      state.sprites.platform[0].sprite.width = 16;
      state.sprites.platform[0].sprite.height = 16;

      render({
        initProps,
        state,
        delta: 1,
      });

      expect(state.character.collisions).toEqual({
        platformLeft: false,
        platformUp: false,
        platformRight: false,
        platformBottom: true,
      });
    });
  });
});

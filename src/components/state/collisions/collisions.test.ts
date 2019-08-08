import * as PIXI from 'pixi.js';
import { collidesWithPlatform } from './collisions';

describe('Collisions', () => {
  describe('character collisions with platform', () => {
    it('does not detect collision of platform with character if there is none', () => {
      const testBox = {
        x: 0,
        y: 0,
        width: 10,
        height: 20,
      };
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
      const testTileSprite = new PIXI.Sprite();
      testTileSprite.x = 13;
      testTileSprite.y = 0;
      const platform = [{ sprite: testTileSprite, tile }];

      expect(collidesWithPlatform(testBox, platform, 4)).toEqual({
        h: -1,
        v: 0,
      });
    });
  });
});

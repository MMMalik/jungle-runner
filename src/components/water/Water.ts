import * as PIXI from 'pixi.js';
import { TileType, WaterTile } from '../state/level';
import { JungleRunnerGameComponent } from '../../types';
import { noop } from '../../framework';

const Water: JungleRunnerGameComponent<PIXI.Sprite> = (_, state) => {
  const water = state.game.level.tiles
    .filter(tile => tile.type === TileType.Water)
    .map((tile: WaterTile) => {
      const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
      sprite.tint = 0x23c2ff;
      sprite.x = tile.x;
      sprite.y = tile.y;
      return { sprite, tile };
    });

  const sprites = water.map(({ sprite }) => sprite);
  state.world.water = water;

  return {
    elements: sprites,
    render: noop,
  };
};

export default Water;

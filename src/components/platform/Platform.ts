import * as PIXI from 'pixi.js';
import { Textures } from '../../constants/Textures';
import { TileType, PlatformTile } from '../state/level';
import { JungleRunnerGameComponent } from '../../types';
import { noop } from '../../framework';

const Platform: JungleRunnerGameComponent<PIXI.Sprite> = (_, state) => {
  const resource = PIXI.Loader.shared.resources[Textures.Jungle];

  const tileSprites = state.game.level.tiles
    .reduce((acc, row) => row.concat(acc), [])
    .filter(tile => tile.type === TileType.Platform)
    .map((tile: PlatformTile) => {
      const sprite = new PIXI.Sprite(
        resource.textures![`jungle tileset${tile.tileId - 1}.png`]
      );
      sprite.x = tile.x;
      sprite.y = tile.y;
      return { sprite, tile };
    });

  state.world.platform = tileSprites;

  const sprites = tileSprites.map(({ sprite }) => sprite);

  return {
    elements: sprites,
    render: noop,
  };
};

export default Platform;

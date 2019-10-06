import * as PIXI from 'pixi.js';
import { Textures } from '../../constants/Textures';
import { TileType, PlatformTile } from '../state/level';
import { JungleRunnerGameComponent } from '../../types';
import { noop } from '../../framework';

const textures: { [key: number]: string } = {
  1: Textures.Jungle,
  2: Textures.Jungle,
  3: Textures.Forest,
};

const levelTileNames: { [key: number]: (tileId: number) => string } = {
  1: tileId => `jungle tileset${tileId - 1}.png`,
  2: tileId => `jungle tileset${tileId - 1}.png`,
  3: tileId => `forest_tileset${tileId - 1}.png`,
};

const Platform: JungleRunnerGameComponent<PIXI.Sprite> = (_, state) => {
  const levelNum = state.game.level.num;
  const resource = PIXI.Loader.shared.resources[textures[levelNum]];

  const tileSprites = state.game.level.tiles
    .filter(tile => tile.type === TileType.Platform)
    .map((tile: PlatformTile) => {
      const sprite = new PIXI.Sprite(
        resource.textures![levelTileNames[levelNum]!(tile.tileId)]
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

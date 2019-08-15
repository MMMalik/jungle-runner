import * as PIXI from 'pixi.js';
import { Textures } from '../../constants/Textures';
import { TileType, PlatformTile } from '../state/level';
import { JungleRunnerGameComponent, JungleRunnerRender } from '../../types';
import { isCharacterPastTheMiddle } from '../../state';

export const render: JungleRunnerRender<PIXI.Sprite> = ({
  initProps,
  state,
  elements,
}) => {
  if (
    state.character.vX > 0 &&
    isCharacterPastTheMiddle(initProps.canvas, state.sprites.character)
  ) {
    elements.forEach(tile => {
      tile.x = tile.x - state.character.vX;
    });
  }
};

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

  state.sprites.platform = tileSprites;

  const sprites = tileSprites.map(({ sprite }) => sprite);

  return {
    elements: sprites,
    render,
  };
};

export default Platform;

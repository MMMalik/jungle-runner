import * as PIXI from 'pixi.js';
import {
  GameComponent,
  ComponentCommonProps,
  Render,
} from '../component/index.js';
import { GameState } from '../../state/state.js';
import { Textures } from '../../constants/Textures';
import { debugSprite } from '../../utils/debug';
import { TileType, PlatformTile } from '../state/level';

export const render: Render<GameState, { elements: PIXI.Sprite[] }> = ({
  state,
  elements,
}) => {
  elements.forEach(tile => {
    tile.x -= state.character.vX;
  });
};

const Platform: GameComponent<ComponentCommonProps, PIXI.Sprite, GameState> = (
  _,
  state
) => {
  const resource = PIXI.Loader.shared.resources[Textures.Jungle];

  const tileSprites = state.level
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
    debug: debugSprite(sprites),
    render,
  };
};

export default Platform;

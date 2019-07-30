import * as PIXI from 'pixi.js';
import jungle from '../../assets/levels/level1.json';
import {
  GameComponent,
  ComponentCommonProps,
  Render,
} from '../component/index.js';
import { GameState } from '../../state/state.js';
import { Textures } from '../../constants/Textures';
import { debugSprite } from '../../utils/debug';

interface TileMap {
  layers: Array<{ data: number[] }>;
  height: number;
  tileheight: number;
  width: number;
  tilewidth: number;
}

export interface PlatformTile {
  tileWidth: number;
  tileHeight: number;
  tileId: number;
  x: number;
  y: number;
  hasNeighborLeft: boolean;
  hasNeighborRight: boolean;
  hasNeighborDown: boolean;
  hasNeighborUp: boolean;
}

const createTiles = (): PlatformTile[][] => {
  const jungleTileMap = jungle as TileMap;
  const array2d = Array.from({ length: jungleTileMap.height }).map((_, i) =>
    jungleTileMap.layers[0].data.slice(
      i * jungleTileMap.width,
      (i + 1) * jungleTileMap.width
    )
  );
  return array2d.map((row, i) => {
    return row.map((tileId, j) => ({
      tileId,
      tileWidth: jungleTileMap.tilewidth,
      tileHeight: jungleTileMap.tileheight,
      x: jungleTileMap.tilewidth * j,
      y: jungleTileMap.tileheight * i,
      hasNeighborLeft: !!array2d[i][j - 1],
      hasNeighborRight: !!array2d[i][j + 1],
      hasNeighborDown:
        i >= 0 && i < array2d.length - 1 ? !!array2d[i + 1][j] : false,
      hasNeighborUp: i > 0 && i < array2d.length ? !!array2d[i - 1][j] : false,
    }));
  });
};

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
  const tiles = createTiles();

  const tileSprites = tiles
    .reduce((acc, row) => row.concat(acc), [])
    .filter(t => t.tileId !== 0)
    .map(tile => {
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

import * as PIXI from 'pixi.js';
import { Textures } from '../../constants/Textures';
import { GameComponent, ComponentCommonProps, Render } from '../component';
import { isMovingX, GameState } from '../../state';

// Value of `asset` corresponds to respective layer names in background.json asset.
// Values of vX correspond to relative velocity of each layer. The further the layer is placed, the slower it seems to move.
export const assets = [
  { asset: 'plx-10.png', vX: 0.25 },
  { asset: 'plx-11.png', vX: 0.3 },
  { asset: 'plx-12.png', vX: 0.35 },
  { asset: 'plx-12.png', vX: 0.4 },
  { asset: 'plx-14.png', vX: 0.45 },
];

// Size of layer (px).
const BackgroundWidth = 384;
const BackgroundHeight = 216;

export const render: Render<GameState, { elements: PIXI.TilingSprite[] }> = ({
  state,
  elements,
}) => {
  elements.forEach((tile, i) => {
    tile.tilePosition.x -= assets[i].vX * state.character.vX;
  });
};

/**
 * Background component initializes parallax background.
 * The main character does not move, it is the background which gives a scrolling effect.
 */
const Background: GameComponent<
  ComponentCommonProps,
  PIXI.TilingSprite,
  GameState
> = ({ canvas }) => {
  const resource = PIXI.Loader.shared.resources[Textures.Background];
  const tiles = assets.map(
    ({ asset }) => new PIXI.TilingSprite(resource.textures![asset])
  );

  tiles.forEach(tile => {
    tile.scale.x = canvas.scrollWidth / BackgroundWidth;
    tile.scale.y = canvas.scrollHeight / BackgroundHeight;
    tile.height = canvas.scrollHeight;
    tile.width = canvas.scrollWidth;
  });

  return {
    elements: tiles,
    render,
  };
};

export default Background;

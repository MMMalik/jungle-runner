import * as PIXI from 'pixi.js';
import { Textures } from '../../constants/Textures';
import { GameComponent, ComponentCommonProps } from '../component';
import { isRunning } from '../../state';

// value of `asset` corresponds to respective layer names in background.json asset
const assets = [
  { asset: 'plx-10.png', vX: 0.25 },
  { asset: 'plx-11.png', vX: 0.3 },
  { asset: 'plx-12.png', vX: 0.35 },
  { asset: 'plx-12.png', vX: 0.4 },
  { asset: 'plx-14.png', vX: 0.45 },
];

const BackgroundWidth = 384;
const BackgroundHeight = 216;

const Background: GameComponent<ComponentCommonProps, PIXI.TilingSprite> = ({
  canvas,
  state,
}) => {
  const resource = PIXI.Loader.shared.resources[Textures.Background];
  const tiles = assets.map(({ asset, vX }) => ({
    tile: new PIXI.TilingSprite(resource.textures![asset]),
    vX,
  }));

  tiles.forEach(({ tile }) => {
    tile.scale.x = canvas.scrollWidth / BackgroundWidth;
    tile.scale.y = canvas.scrollHeight / BackgroundHeight;
    tile.height = canvas.scrollHeight;
    tile.width = canvas.scrollWidth;
  });

  return {
    element: tiles.map(({ tile }) => tile),
    render: () => {
      const { ArrowLeft, ArrowRight } = state.keyboard;
      if (isRunning(ArrowLeft, ArrowRight)) {
        tiles.forEach(({ tile, vX }) => {
          tile.tilePosition.x -= vX * state.character.vX;
        });
      }
    },
  };
};

export default Background;

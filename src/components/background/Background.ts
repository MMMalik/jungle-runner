import * as PIXI from 'pixi.js';
import { Textures } from '../../constants';
import { JungleRunnerRender, JungleRunnerGameComponent } from '../../types';

export const assets = [
  { asset: 'plx-10.png', vX: 0.25 },
  { asset: 'plx-11.png', vX: 0.3 },
  { asset: 'plx-12.png', vX: 0.35 },
  { asset: 'plx-12.png', vX: 0.4 },
  { asset: 'plx-14.png', vX: 0.45 },
];

const BackgroundWidth = 384;
const BackgroundHeight = 216;

export const render: JungleRunnerRender<PIXI.TilingSprite> = ({
  state,
  elements,
}) => {
  elements.forEach((tile, i) => {
    tile.tilePosition.x -= assets[i].vX * state.character.vX;
  });
};

const Background: JungleRunnerGameComponent<PIXI.TilingSprite> = ({
  canvas,
}) => {
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

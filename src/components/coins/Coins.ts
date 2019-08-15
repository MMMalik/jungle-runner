import * as PIXI from 'pixi.js';
import { Textures } from '../../constants/Textures';
import { TileType, CoinTile } from '../state/level';
import { JungleRunnerRender, JungleRunnerGameComponent } from '../../types';

export const render: JungleRunnerRender<PIXI.Sprite> = ({
  state,
  elements,
}) => {
  elements.forEach(tile => {
    tile.x -= state.character.vX;
  });
};

const resources: { [key: number]: () => PIXI.LoaderResource } = {
  327: () => PIXI.Loader.shared.resources[Textures.CoinGold],
  328: () => PIXI.Loader.shared.resources[Textures.CoinGreen],
};

const Coins: JungleRunnerGameComponent<PIXI.Sprite> = (_, state) => {
  const coins = state.game.level.tiles
    .reduce((acc, row) => row.concat(acc), [])
    .filter(tile => tile.type === TileType.Coin)
    .map((tile: CoinTile) => {
      const sprite = new PIXI.AnimatedSprite(
        resources[tile.tileId]().spritesheet!.animations.rotate
      );
      sprite.x = tile.x;
      sprite.y = tile.y;
      sprite.animationSpeed = 0.15;
      sprite.play();
      return { sprite, tile };
    });

  const sprites = coins.map(({ sprite }) => sprite);
  state.sprites.coins = coins;

  return {
    elements: sprites,
    render,
  };
};

export default Coins;

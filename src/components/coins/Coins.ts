import * as PIXI from 'pixi.js';
import { Textures } from '../../constants/Textures';
import { TileType, CoinTile } from '../state/level';
import { JungleRunnerGameComponent } from '../../types';
import { noop, debugSprite } from '../../framework';

const resources: { [key: number]: () => PIXI.LoaderResource } = {
  327: () => PIXI.Loader.shared.resources[Textures.CoinGold],
  328: () => PIXI.Loader.shared.resources[Textures.CoinGreen],
};

const Coins: JungleRunnerGameComponent<PIXI.Sprite> = (_, state) => {
  const coins = state.game.level.tiles
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
  state.world.coins = coins;

  return {
    elements: sprites,
    render: noop,
  };
};

export default Coins;

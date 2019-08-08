import * as PIXI from 'pixi.js';
import { Textures } from '../../constants/Textures';
import { GameComponent, ComponentCommonProps, Render } from '../component';
import { GameState } from '../../state';
import { TileType, CoinTile } from '../state/level';

export const render: Render<GameState, { elements: PIXI.Sprite[] }> = ({
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

const Coins: GameComponent<ComponentCommonProps, PIXI.Sprite, GameState> = (
  _,
  state
) => {
  const coins = state.level
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

import { GameState, TiledSprite } from '../../../state';
import { CoinTile } from '../level';
import { AllCollisions } from '../collisions';

export const updateCoinsState = (
  { world }: GameState,
  { characterCollisionsWithCoin }: AllCollisions
): TiledSprite<PIXI.AnimatedSprite, CoinTile, {}> => {
  if (!characterCollisionsWithCoin) {
    return world.coins;
  }

  characterCollisionsWithCoin.sprite.parent.removeChild(
    characterCollisionsWithCoin.sprite
  );

  return world.coins.filter(
    coin => coin.tile.uid !== characterCollisionsWithCoin.tile.uid
  );
};

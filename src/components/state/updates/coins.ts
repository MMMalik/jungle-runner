import { GameState, TiledSprite } from '../../../state';
import { AllCollisions } from '../State';
import { CoinTile } from '../level';

export const updateCoinsState = (
  { world }: GameState,
  { characterCollisions: { characterCollisionsWithCoin } }: AllCollisions
): TiledSprite<PIXI.AnimatedSprite, CoinTile> => {
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

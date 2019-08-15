import { GameState, TiledSprite } from '../../../state';
import { AllCollisions } from '../State';
import { CoinTile } from '../level';

export const updateCoinsState = (
  { sprites }: GameState,
  { characterCollisions: { characterCollisionsWithCoin } }: AllCollisions
): TiledSprite<PIXI.AnimatedSprite, CoinTile> => {
  if (!characterCollisionsWithCoin) {
    return sprites.coins;
  }

  characterCollisionsWithCoin.sprite.parent.removeChild(
    characterCollisionsWithCoin.sprite
  );

  return sprites.coins.filter(
    coin => coin.tile.uid !== characterCollisionsWithCoin.tile.uid
  );
};

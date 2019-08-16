import * as PIXI from 'pixi.js';
import { Textures } from '../../constants/Textures';
import { TileType, EnemyTile } from '../state/level';
import { JungleRunnerGameComponent, JungleRunnerRender } from '../../types';
import { Enemies } from '../../constants/Enemies';

const resources: { [key: number]: () => PIXI.LoaderResource } = {
  332: () => PIXI.Loader.shared.resources[Textures.Totem],
};

export const render: JungleRunnerRender<PIXI.Sprite> = ({ state }) => {
  state.world.enemies.totems.forEach(({ sprite, vX }) => {
    sprite.x += vX;
    sprite.scale.x = Math.abs(sprite.scale.x) * vX / Math.abs(vX);
  });
};

const Totems: JungleRunnerGameComponent<PIXI.Sprite> = (_, state) => {
  const totems = state.game.level.tiles
    .filter(tile => tile.type === TileType.Enemy)
    .map((tile: EnemyTile) => {
      const sprite = new PIXI.AnimatedSprite(
        resources[tile.tileId]().spritesheet!.animations.walk
      );
      sprite.x = tile.x;
      sprite.y = tile.y + 3;
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;
      sprite.scale.x = 0.5;
      sprite.scale.y = 0.5;
      sprite.animationSpeed = 0.15;
      sprite.play();
      return { sprite, tile, vX: Enemies.Totems.vX };
    });

  const sprites = totems.map(({ sprite }) => sprite);
  state.world.enemies.totems = totems;

  return {
    elements: sprites,
    render,
  };
};

export default Totems;

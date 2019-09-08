import * as PIXI from 'pixi.js';
import { TileType, WaspTile } from '../state/level';
import { JungleRunnerGameComponent, JungleRunnerRender } from '../../types';
import { Textures, Enemies } from '../../constants';

const texture = () => PIXI.Loader.shared.resources[Textures.Wasp];

export const render: JungleRunnerRender<PIXI.Sprite> = ({ state }) => {
  state.world.enemies.wasps.forEach(({ sprite, vX, vY }) => {
    sprite.x += vX;
    sprite.y += vY;
    sprite.scale.x = (Math.abs(sprite.scale.x) * vX) / Math.abs(vX);
  });
};

const Wasps: JungleRunnerGameComponent<PIXI.Sprite> = (_, state) => {
  const wasps = state.game.level.tiles
    .filter(tile => tile.type === TileType.Wasp)
    .map((tile: WaspTile) => {
      const sprite = new PIXI.AnimatedSprite(
        texture().spritesheet!.animations.fly
      );
      sprite.scale.x = 0.5;
      sprite.scale.y = 0.5;
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;
      sprite.x = tile.x;
      sprite.y = tile.y;
      sprite.animationSpeed = 0.15;
      sprite.play();
      return { sprite, tile, vX: Enemies.Totems.vX, vY: 0 };
    });

  const sprites = wasps.map(({ sprite }) => sprite);
  state.world.enemies.wasps = wasps;

  return {
    elements: sprites,
    render,
  };
};

export default Wasps;

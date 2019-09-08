import * as PIXI from 'pixi.js';
import { TileType, TotemTile } from '../state/level';
import { JungleRunnerGameComponent, JungleRunnerRender } from '../../types';
import { GameConst, Textures, Enemies } from '../../constants';

const texture = () => PIXI.Loader.shared.resources[Textures.Totem];

export const render: JungleRunnerRender<PIXI.Sprite> = ({ state }) => {
  state.world.enemies.totems.forEach(({ sprite, vX, vY }) => {
    sprite.x += vX;
    sprite.y += vY;
    sprite.scale.x = (Math.abs(sprite.scale.x) * vX) / Math.abs(vX);
  });
};

const Totems: JungleRunnerGameComponent<PIXI.Sprite> = (_, state) => {
  const totems = state.game.level.tiles
    .filter(tile => tile.type === TileType.Totem)
    .map((tile: TotemTile) => {
      const sprite = new PIXI.AnimatedSprite(
        texture().spritesheet!.animations.walk
      );
      sprite.scale.x = 0.5;
      sprite.scale.y = 0.5;
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;
      sprite.x = tile.x;
      sprite.y = tile.y;
      sprite.animationSpeed = 0.15;
      sprite.play();
      return { sprite, tile, vX: Enemies.Totems.vX, vY: GameConst.Gravity };
    });

  const sprites = totems.map(({ sprite }) => sprite);
  state.world.enemies.totems = totems;

  return {
    elements: sprites,
    render,
  };
};

export default Totems;

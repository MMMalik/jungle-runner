import * as PIXI from 'pixi.js';
import { GameComponent, ComponentCommonProps } from '../component';
import {
  Textures,
  GameConst,
  CharacterConst,
  Directions,
} from '../../constants';
import { runningDirection, isRunning, isJumping } from '../../state';

const Resources = {
  Idle: () => PIXI.Loader.shared.resources[Textures.CharacterIdle],
  Running: () => PIXI.Loader.shared.resources[Textures.CharacterRunning],
  Jumping: () => PIXI.Loader.shared.resources[Textures.CharacterJumping],
  Landing: () => PIXI.Loader.shared.resources[Textures.CharacterLanding],
};

const AnimationNames = {
  Idle: 'idle',
  Running: 'run',
  Jumping: 'jump',
  Landing: 'landing',
};

const getTextures = (resource: PIXI.LoaderResource, name: string) =>
  resource.spritesheet!.animations[name];

const areSameTextures = (texture1: PIXI.Texture[], texture2: PIXI.Texture[]) =>
  texture1 === texture2;

const getCurrentTexture = (
  running: boolean,
  jumping: boolean,
  onTheGround: boolean
) => {
  if (running && !jumping && onTheGround) {
    return getTextures(Resources.Running(), AnimationNames.Running);
  } else if (jumping) {
    return getTextures(Resources.Jumping(), AnimationNames.Jumping);
  } else if (!onTheGround) {
    return getTextures(Resources.Landing(), AnimationNames.Landing);
  } else {
    return getTextures(Resources.Idle(), AnimationNames.Idle);
  }
};

const isOnTheGround = (canvas: HTMLCanvasElement, sprite: PIXI.Sprite) => {
  return sprite.y >= canvas.scrollHeight / 2;
};

const Character: GameComponent<ComponentCommonProps, PIXI.Sprite> = ({
  canvas,
  state,
}) => {
  const sprite = new PIXI.AnimatedSprite(
    getTextures(Resources.Idle(), AnimationNames.Idle)
  );
  sprite.scale = new PIXI.Point(GameConst.ScaleX, GameConst.ScaleY);
  sprite.anchor = new PIXI.Point(0.5, 0.5);
  sprite.animationSpeed = CharacterConst.AnimationSpeed;
  sprite.x = canvas.scrollWidth / 2;
  sprite.y = canvas.scrollHeight / 2;
  sprite.play();

  return {
    element: sprite,
    render: () => {
      const { ArrowLeft, ArrowRight, Space } = state.keyboard;
      const { vX, jumpTicks } = state.character;
      const running = isRunning(ArrowRight, ArrowLeft);
      const jumping = isJumping(jumpTicks);
      const onTheGround = isOnTheGround(canvas, sprite);
      const direction = runningDirection(ArrowRight, ArrowLeft);
      const currentTextures = getCurrentTexture(running, jumping, onTheGround);

      if (!onTheGround) {
        sprite.y += GameConst.Gravity;
      }

      state.character.vX = direction * CharacterConst.BaseVx;
      sprite.scale.x =
        Math.abs(sprite.scale.x) * (direction || Directions.Right);

      if (Space && onTheGround) {
        state.character.jumpTicks = 1;
      }

      if (jumping) {
        sprite.y -= CharacterConst.BaseJumpHeight;
        state.character.jumpTicks =
          jumpTicks >= CharacterConst.MaxJumpTicks ? 0 : jumpTicks + 1;
      }

      if (!areSameTextures(sprite.textures, currentTextures)) {
        sprite.textures = currentTextures;
        sprite.play();
      }
    },
  };
};

export default Character;

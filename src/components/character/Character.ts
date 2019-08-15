import * as PIXI from 'pixi.js';
import { Textures, GameConst, CharacterConst } from '../../constants';
import { JungleRunnerRender, JungleRunnerGameComponent } from '../../types';
import { isCharacterPastTheMiddle } from '../../state';

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

export const getTextures = (resource: PIXI.LoaderResource, name: string) => {
  return resource.spritesheet!.animations[name];
};

export const areSameTextures = (
  textures1: PIXI.Texture[],
  textures2: PIXI.Texture[]
) => textures1 === textures2;

export const getCurrentTexture = (resources: typeof Resources) => (
  movingX: boolean,
  jumping: boolean,
  onTheGround: boolean
) => {
  if (jumping) {
    return getTextures(resources.Jumping(), AnimationNames.Jumping);
  }

  if (!onTheGround && !jumping) {
    return getTextures(resources.Landing(), AnimationNames.Landing);
  }

  if (movingX && onTheGround) {
    return getTextures(resources.Running(), AnimationNames.Running);
  }

  return getTextures(resources.Idle(), AnimationNames.Idle);
};

export const getInitPosition = (canvas: HTMLCanvasElement) => ({
  x: canvas.width / 2,
  y: canvas.height / 2,
});

export const isOnTheGround = (
  canvas: HTMLCanvasElement,
  sprite: PIXI.Sprite
) => {
  return sprite.y >= canvas.height / 2;
};

export const render: (
  resources: typeof Resources
) => JungleRunnerRender<PIXI.AnimatedSprite> = resources => ({
  initProps,
  elements,
  state,
}) => {
  elements.forEach(element => {
    const {
      vY,
      vX,
      onTheGround,
      movingX,
      jumping,
      direction,
    } = state.character;
    const currentTextures = getCurrentTexture(resources)(
      movingX,
      jumping,
      !!onTheGround
    );

    element.y += vY;
    element.x =
      vX < 0 ||
      !isCharacterPastTheMiddle(initProps.canvas, state.sprites.character)
        ? element.x + vX
        : element.x;
    element.scale.x = Math.abs(element.scale.x) * direction;

    if (!areSameTextures(element.textures, currentTextures)) {
      element.textures = currentTextures;
      element.play();
    }
  });
};

export const initCharacterSprite = (
  canvas: HTMLCanvasElement,
  sprite: PIXI.AnimatedSprite
) => {
  const { x, y } = getInitPosition(canvas);
  sprite.scale = new PIXI.Point(GameConst.ScaleX, GameConst.ScaleY);
  sprite.anchor = new PIXI.Point(0.5, 0.5);
  sprite.animationSpeed = CharacterConst.AnimationSpeed;
  sprite.x = x;
  sprite.y = y;
  sprite.play();
};

const Character: JungleRunnerGameComponent<PIXI.AnimatedSprite> = (
  { canvas },
  state
) => {
  const sprite = new PIXI.AnimatedSprite(
    getTextures(Resources.Idle(), AnimationNames.Idle)
  );
  initCharacterSprite(canvas, sprite);
  state.sprites.character = sprite;

  return {
    elements: [sprite],
    render: render(Resources),
  };
};

export default Character;

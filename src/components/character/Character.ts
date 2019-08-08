import * as PIXI from 'pixi.js';
import { GameComponent, ComponentCommonProps, Render } from '../component';
import { Textures, GameConst, CharacterConst } from '../../constants';
import { GameState } from '../../state';
import { debugSprite } from '../../utils/debug';

// Map resource name to actual Pixi loader resource.
const Resources = {
  Idle: () => PIXI.Loader.shared.resources[Textures.CharacterIdle],
  Running: () => PIXI.Loader.shared.resources[Textures.CharacterRunning],
  Jumping: () => PIXI.Loader.shared.resources[Textures.CharacterJumping],
  Landing: () => PIXI.Loader.shared.resources[Textures.CharacterLanding],
};

// Map keys to actual animation names
const AnimationNames = {
  Idle: 'idle',
  Running: 'run',
  Jumping: 'jump',
  Landing: 'landing',
};

/**
 * Get Pixi textures associated with the given resource and animation name.
 *
 * @param resource Pixi loader resource
 * @param name Pixi animation name
 */
export const getTextures = (resource: PIXI.LoaderResource, name: string) => {
  return resource.spritesheet!.animations[name];
};

/**
 * Compare if textures are equal.
 *
 * @param textures1 Pixi textures to compare
 * @param textures2 Pixi textures to compare
 */
export const areSameTextures = (
  textures1: PIXI.Texture[],
  textures2: PIXI.Texture[]
) => textures1 === textures2;

/**
 * Returns current textures based on the character's state.
 *
 * @param movingX If character is moving on X axis
 * @param jumping If character is jumping
 * @param onTheGround If character is on the ground
 */
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

/**
 * Checks if character is on the ground.
 *
 * @param canvas Html canvas element
 * @param sprite Pixi sprite
 */
export const isOnTheGround = (
  canvas: HTMLCanvasElement,
  sprite: PIXI.Sprite
) => {
  return sprite.y >= canvas.height / 2;
};

export const render = (
  resources: typeof Resources
): Render<GameState, { element: PIXI.AnimatedSprite }> => ({
  element,
  state,
}) => {
  const { vY, onTheGround, movingX, jumping, direction } = state.character;
  const currentTextures = getCurrentTexture(resources)(
    movingX,
    jumping,
    !!onTheGround
  );

  element.y += vY;
  element.scale.x = Math.abs(element.scale.x) * direction;

  // If calculated textures and current sprite's textures are not equal, replace them.
  if (!areSameTextures(element.textures, currentTextures)) {
    element.textures = currentTextures;
    element.play();
  }
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

/**
 * Game component for main character.
 */
const Character: GameComponent<
  ComponentCommonProps,
  PIXI.AnimatedSprite,
  GameState
> = ({ canvas }, state) => {
  const sprite = new PIXI.AnimatedSprite(
    getTextures(Resources.Idle(), AnimationNames.Idle)
  );
  initCharacterSprite(canvas, sprite);
  state.sprites.character = sprite;

  return {
    element: sprite,
    debug: debugSprite([sprite]),
    render: render(Resources),
  };
};

export default Character;

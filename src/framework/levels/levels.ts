import * as PIXI from 'pixi.js';
import * as WebFont from 'webfontloader';
import {
  initComponents,
  GameComponent,
  ComponentCommonProps,
  CleanupFn,
} from '../component';
import { noop } from '../helpers';
import { camera, CameraFollowFn } from '../world';

type GameStages<T> = {
  [P in keyof T]: NextStageInit<T>;
};

export type NextStageFn<T> = (id: keyof T) => void;

type InitFn<T> = (n: NextStageFn<T>) => CleanupFn;

type NextStageInit<T> = () => InitFn<T>;

type Components<GameState, OwnGameStages> = Array<
  GameComponent<
    ComponentCommonProps<OwnGameStages>,
    PIXI.DisplayObject,
    GameState
  >
>;

type InitLevel = <GameState, OwnGameStages>(
  app: PIXI.Application,
  state: GameState,
  canvas: HTMLCanvasElement,
  components: Components<GameState, OwnGameStages>,
  cameraFollowFn: CameraFollowFn<GameState>
) => InitFn<OwnGameStages>;

export const manageStages = <K extends {}>(outcomes: GameStages<K>) => {
  let cleanup = noop;

  const nextStage = (id: keyof K) => {
    cleanup();
    const outcome = outcomes[id];
    cleanup = outcome()(nextStage);
  };

  return nextStage;
};

export const initLevel: InitLevel = (
  app,
  state,
  canvas,
  components,
  followFn
) => nextStage => {
  const { container, updateFn } = camera(followFn);
  app.stage.addChild(container);

  const props = {
    canvas,
    container,
    nextStage,
  };

  return initComponents(app, props, state, components, updateFn);
};

export const initPixiApp = (canvas: HTMLCanvasElement): PIXI.Application => {
  const config = {
    view: canvas,
    height: canvas.scrollHeight,
    width: canvas.scrollWidth,
    antialias: true,
  };
  const app = new PIXI.Application(config);
  app.renderer.render(app.stage);

  return app;
};

export const loadAssets = (textures: { [key: string]: string }) => {
  return new Promise(resolve => {
    PIXI.Loader.shared.add(
      Object.keys(textures).map((key: keyof typeof textures) => textures[key])
    );
    PIXI.Loader.shared.load(resolve);
  });
};

export const loadFonts = (fontFamilies: string[]) => {
  return new Promise(resolve => {
    WebFont.load({
      custom: {
        families: fontFamilies,
      },
      active: resolve,
    });
  });
};

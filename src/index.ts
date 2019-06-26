import * as PIXI from 'pixi.js';
import { Textures } from './constants';
import initState from './state';
import createComponent from './components/component';
import Background from './components/background';
import Character from './components/character';
import Keyboard from './components/keyboard';

/**
 * Initialize Pixi application.
 * @param canvas Canvas element to embed game into
 */
const initPixiApp = (canvas: HTMLCanvasElement): PIXI.Application => {
  const config = {
    view: canvas,
    height: canvas.scrollHeight,
    width: canvas.scrollWidth,
  };
  const app = new PIXI.Application(config);
  app.renderer.render(app.stage);

  return app;
};

/**
 * Promisified Pixi loader.
 */
const loadAssets = () => {
  return new Promise(resolve => {
    PIXI.Loader.shared.add(
      Object.keys(Textures).map((key: keyof typeof Textures) => Textures[key])
    );
    PIXI.Loader.shared.load(resolve);
  });
};

/**
 * Get canvas element, load assets, then initialize Pixi app.
 * Once the app is initialized, create game components.
 * Each sprite from game component will be added to the Pixi container.
 * Each render function will added to the shared ticker.
 */
const init = async () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement | null;

  if (!canvas) {
    return;
  }

  await loadAssets();

  const app = initPixiApp(canvas);
  const container = new PIXI.Container();
  const state = initState();

  app.stage.addChild(container);

  const props = {
    canvas,
    container,
  };

  [Background, Character, Keyboard]
    .map(Component => createComponent(Component, props, state))
    .filter(Boolean)
    .forEach(({ element, elements, render }) => {
      if (element) {
        container.addChild(element);
      }

      if (elements) {
        elements.forEach(el => {
          container.addChild(el);
        });
      }

      const ticker = (delta: number) => {
        if (render) {
          render({
            initProps: props,
            state,
            element: element || new PIXI.Sprite(),
            elements: elements || [],
            delta,
          });
        }
      };

      app.ticker.add(ticker);
    });
};

init();

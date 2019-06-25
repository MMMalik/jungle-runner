import * as PIXI from 'pixi.js';
import { Textures } from './constants';
import createComponent from './components/component';
import Background from './components/background';
import Character from './components/character';
import initState from './state';
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
 * Promisified version of Pixi loader.
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
 */
const init = async () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement | null;

  if (!canvas) {
    return;
  }

  await loadAssets();

  const app = initPixiApp(canvas);
  const container = new PIXI.Container();
  app.stage.addChild(container);

  const props = {
    canvas,
    container,
    state: initState(),
  };

  [Background, Character, Keyboard]
    .map(Component => createComponent(Component, props))
    .filter(Boolean)
    .forEach(({ element, update, render }) => {
      if (Array.isArray(element)) {
        element.forEach(el => {
          container.addChild(el);
        });
      } else if (element) {
        container.addChild(element);
      }
      const ticker = () => {
        if (render) {
          render();
        }
        if (update) {
          update();
        }
      };
      app.ticker.add(ticker);
    });
};

init();

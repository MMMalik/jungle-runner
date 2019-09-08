import * as PIXI from 'pixi.js';
import { loadAssets, timeout, NextStageFn } from '../../framework';
import { Textures, JungleRunnerGameStages } from '../../constants';
import { JungleRunnerGameComponent, JungleRunnerRender } from '../../types';
import { GameState } from '../../state';
import { TileMap, initWorld } from '../state/level';

const loadLevel = async (levelNum: number) => {
  return import(`../../assets/levels/level${levelNum}.json`);
};

const loadLevelAssets = (
  nextStage: NextStageFn<typeof JungleRunnerGameStages>,
  state: GameState
) => {
  PIXI.Loader.shared.reset();
  PIXI.utils.clearTextureCache();
  Promise.all([
    loadAssets(Textures),
    loadLevel(state.game.level.num),
    timeout(2000),
  ]).then(([_, tileMap]: [any, TileMap, any]) => {
    const { camera, size, tiles } = initWorld(tileMap, state.game.level.num);
    state.camera = camera;
    state.world.size = size;
    state.game.level.tiles = tiles;
    nextStage(JungleRunnerGameStages.NextLevel);
  });
};

export const render = (): JungleRunnerRender<PIXI.Text> => {
  let i = 0;
  return ({ elements }) => {
    const [_, loadingText] = elements;
    loadingText.visible = Math.floor(i / 30) % 2 === 0;
    i++;
  };
};

const LoadScreen: JungleRunnerGameComponent<PIXI.Text> = (
  { canvas, nextStage },
  state
) => {
  const levelText = new PIXI.Text(`Level ${state.game.level.num}\n\n\n\n`, {
    fontFamily: 'EquipmentPro',
    fill: '#fff',
  });

  const loadingText = new PIXI.Text(`Loading...`, {
    fontFamily: 'EquipmentPro',
    fill: '#fff',
  });

  levelText.anchor.x = 0.5;
  levelText.anchor.y = 0.5;
  levelText.position.x = canvas.width / 2;
  levelText.position.y = canvas.height / 2;

  loadingText.anchor.x = 0.5;
  loadingText.anchor.y = 0.5;
  loadingText.position.x = canvas.width / 2;
  loadingText.position.y = canvas.height / 2;

  loadLevelAssets(nextStage, state);

  return {
    render: render(),
    elements: [levelText, loadingText],
  };
};

export default LoadScreen;

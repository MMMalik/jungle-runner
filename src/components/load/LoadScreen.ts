import * as PIXI from 'pixi.js';
import { loadAssets, timeout, NextStageFn } from '../../framework';
import { Textures, JungleRunnerGameStages } from '../../constants';
import { JungleRunnerGameComponent, JungleRunnerRender } from '../../types';
import { GameState } from '../../state';
import { TileMap, createLevel } from '../state/level';

const loadLevel = async (levelNum: number) => {
  return import(`../../assets/levels/level${levelNum}.json`);
};

const loadLevelAssets = (
  nextStage: NextStageFn<typeof JungleRunnerGameStages>,
  state: GameState
) => {
  Promise.all([
    loadAssets(Textures),
    loadLevel(state.game.level.num),
    timeout(2000),
  ]).then(([_, tileMap]: [any, TileMap, any]) => {
    state.game.level.tiles = createLevel(tileMap);
    nextStage(JungleRunnerGameStages.NextLevel);
  });
};

export const render = (): JungleRunnerRender<PIXI.Text> => {
  let i = 0;
  return ({ elements }) => {
    elements.forEach(element => {
      element.visible = Math.floor(i / 30) % 2 === 0;
    });
    i++;
  };
};

const LoadScreen: JungleRunnerGameComponent<PIXI.Text> = (
  { canvas, nextStage },
  state
) => {
  const text = new PIXI.Text(`Loading...`, {
    fontFamily: 'EquipmentPro',
    fill: '#fff',
  });

  text.anchor.x = 0.5;
  text.anchor.y = 0.5;
  text.position.x = canvas.width / 2;
  text.position.y = canvas.height / 2;

  state.game.level.num += 1;
  loadLevelAssets(nextStage, state);

  return {
    render: render(),
    elements: [text],
  };
};

export default LoadScreen;

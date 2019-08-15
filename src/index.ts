import './fonts/EquipmentPro.woff';
import initState from './state';
import Background from './components/background';
import Character from './components/character';
import Platform from './components/platform';
import State from './components/state';
import Coins from './components/coins';
import Score from './components/score';
import Lives from './components/lives';
import {
  initPixiApp,
  loadFonts,
  initLevel,
  manageStages,
  loadAssets,
} from './framework';
import FinalScreen from './components/final';
import GameOver from './components/gameOver';
import { JungleRunnerGameStages, Textures } from './constants';
import LoadScreen from './components/load';

const init = async (id: string) => {
  const canvas = document.getElementById(id) as HTMLCanvasElement | null;

  if (!canvas) {
    throw new Error(`No canvas with specified id ${id} found.`);
  }

  const app = initPixiApp(canvas);
  const state = initState();

  await loadFonts(['EquipmentPro']);

  const nextGameStage = manageStages<typeof JungleRunnerGameStages>({
    LoadAssets: () => initLevel(app, state, canvas, [LoadScreen]),
    NextLevel: () =>
      initLevel(app, state, canvas, [
        State,
        Background,
        Platform,
        Character,
        Coins,
        Score,
        Lives,
      ]),
    GameOver: () => initLevel(app, state, canvas, [GameOver]),
    FinalScreen: () => initLevel(app, state, canvas, [FinalScreen]),
  });

  nextGameStage(JungleRunnerGameStages.LoadAssets);

  return () => {
    app.destroy();
  };
};

init('game');

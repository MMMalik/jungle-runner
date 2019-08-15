import './fonts/EquipmentPro.woff';
import initState, { GameState } from './state';
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
  CameraFollowFn,
} from './framework';
import FinalScreen from './components/final';
import GameOver from './components/gameOver';
import { JungleRunnerGameStages } from './constants';
import LoadScreen from './components/load';

const cameraFollowFn: CameraFollowFn<GameState> = state => {
  return child => {
    child.x -= state.camera.vX;
  };
};

const init = async (id: string) => {
  const canvas = document.getElementById(id) as HTMLCanvasElement | null;

  if (!canvas) {
    throw new Error(`No canvas with specified id ${id} found.`);
  }

  const app = initPixiApp(canvas);
  const state = initState();

  await loadFonts(['EquipmentPro']);

  const nextGameStage = manageStages<typeof JungleRunnerGameStages>({
    LoadAssets: () =>
      initLevel(app, state, canvas, [LoadScreen], cameraFollowFn),
    NextLevel: () =>
      initLevel(
        app,
        state,
        canvas,
        [State, Background, Character, Platform, Coins, Score, Lives],
        cameraFollowFn
      ),
    GameOver: () => initLevel(app, state, canvas, [GameOver], cameraFollowFn),
    FinalScreen: () =>
      initLevel(app, state, canvas, [FinalScreen], cameraFollowFn),
  });

  nextGameStage(JungleRunnerGameStages.LoadAssets);

  return () => {
    app.destroy();
  };
};

init('game');

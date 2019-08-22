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
  noop,
} from './framework';
import FinalScreen from './components/final';
import GameOver from './components/gameOver';
import { JungleRunnerGameStages } from './constants';
import LoadScreen from './components/load';
import Enemies from './components/enemies';
import Water from './components/water';
import PlainBackground from './components/plainBackground';

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
  const state = initState({
    camera: {
      vX: 0,
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    },
  });

  await loadFonts(['EquipmentPro']);

  const nextGameStage = manageStages<typeof JungleRunnerGameStages>({
    LoadAssets: () =>
      initLevel(
        app,
        state,
        canvas,
        [PlainBackground, LoadScreen],
        cameraFollowFn
      ),
    NextLevel: () => {
      state.camera = {
        vX: 0,
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
      };

      return initLevel(
        app,
        state,
        canvas,
        [
          State,
          Background,
          Coins,
          Platform,
          Character,
          Enemies,
          Water,
          Score,
          Lives,
        ],
        cameraFollowFn
      );
    },
    GameOver: () =>
      initLevel(app, state, canvas, [PlainBackground, GameOver], () => noop),
    FinalScreen: () =>
      initLevel(app, state, canvas, [PlainBackground, FinalScreen], () => noop),
  });

  nextGameStage(JungleRunnerGameStages.LoadAssets);

  return () => {
    app.destroy();
  };
};

init('game');

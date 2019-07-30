import * as PIXI from 'pixi.js';
import { PlatformTile } from '../components/platform/Platform';

export interface GameState {
  character: {
    vX: number;
    jumpTicks: number;
    collisions: {
      platformH: number;
      platformV: number;
    };
  };
  keyboard: {
    Space: boolean;
    ArrowRight: boolean;
    ArrowLeft: boolean;
  };
  sprites: {
    platform: Array<{ sprite: PIXI.Sprite; tile: PlatformTile }>;
    character: PIXI.Sprite;
  };
}

const initState = (): GameState => ({
  character: {
    vX: 0,
    jumpTicks: 0,
    collisions: {
      platformH: 0,
      platformV: 0,
    },
  },
  keyboard: {
    Space: false,
    ArrowRight: false,
    ArrowLeft: false,
  },
  sprites: {
    platform: [],
    character: new PIXI.Sprite(),
  },
});

export default initState;

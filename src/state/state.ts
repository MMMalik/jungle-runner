import * as PIXI from 'pixi.js';
import { PlatformTile } from '../components/platform/Platform';
import { Directions, GameConst } from '../constants';

export interface GameState {
  character: {
    vX: number;
    vY: number;
    jumpTicks: number;
    movingX: boolean;
    jumping: boolean;
    onTheGround: boolean;
    direction: number;
  };
  sprites: {
    platform: Array<{ sprite: PIXI.Sprite; tile: PlatformTile }>;
    character: PIXI.Sprite;
  };
}

const initState = (): GameState => ({
  character: {
    vX: 0,
    vY: GameConst.Gravity,
    jumpTicks: 0,
    movingX: false,
    jumping: false,
    onTheGround: false,
    direction: Directions.Right,
  },
  sprites: {
    platform: [],
    character: new PIXI.Sprite(),
  },
});

export default initState;

import * as PIXI from 'pixi.js';
import { Directions, GameConst } from '../constants';
import { LevelTile, PlatformTile, CoinTile } from '../components/state/level';

export interface GameState {
  character: {
    vX: number;
    vY: number;
    score: number;
    jumpTicks: number;
    movingX: boolean;
    jumping: boolean;
    onTheGround: boolean;
    direction: number;
  };
  level: LevelTile[][];
  sprites: {
    platform: Array<{ sprite: PIXI.Sprite; tile: PlatformTile }>;
    coins: Array<{ sprite: PIXI.AnimatedSprite; tile: CoinTile }>;
    character: PIXI.Sprite;
  };
}

const initState = (): GameState => ({
  character: {
    vX: 0,
    vY: GameConst.Gravity,
    score: 0,
    jumpTicks: 0,
    movingX: false,
    jumping: false,
    onTheGround: false,
    direction: Directions.Right,
  },
  level: [],
  sprites: {
    platform: [],
    coins: [],
    character: new PIXI.Sprite(),
  },
});

export default initState;

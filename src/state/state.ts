import * as PIXI from 'pixi.js';
import { Directions, GameConst } from '../constants';
import { LevelTile, PlatformTile, CoinTile } from '../components/state/level';

export interface MovableComponent {
  vX: number;
  vY: number;
  lives: number;
  jumpTicks: number;
  movingX: boolean;
  jumping: boolean;
  onTheGround: boolean;
  direction: number;
}

export interface Camera {
  vX: number;
}

export type TiledSprite<T, S> = Array<{
  sprite: T;
  tile: S;
}>;

export interface WorldObjects {
  platform: TiledSprite<PIXI.Sprite, PlatformTile>;
  coins: TiledSprite<PIXI.AnimatedSprite, CoinTile>;
  character: {
    x: number;
    y: number;
    sprite: PIXI.Sprite;
  };
}

export interface GameState {
  game: {
    score: number;
    level: {
      finished: boolean;
      num: number;
      tiles: LevelTile[][];
    };
  };
  camera: Camera;
  character: MovableComponent;
  world: WorldObjects;
}

const initState = (): GameState => ({
  game: {
    score: 0,
    level: {
      num: 0,
      finished: false,
      tiles: [],
    },
  },
  character: {
    vX: 0,
    vY: GameConst.Gravity,
    lives: 3,
    jumpTicks: 0,
    movingX: false,
    jumping: false,
    onTheGround: false,
    direction: Directions.Right,
  },
  camera: {
    vX: 0,
  },
  world: {
    platform: [],
    coins: [],
    character: {
      x: 0,
      y: 0,
      sprite: new PIXI.Sprite(),
    },
  },
});

export default initState;

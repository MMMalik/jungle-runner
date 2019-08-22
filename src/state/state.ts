import * as PIXI from 'pixi.js';
import { Directions, GameConst } from '../constants';
import {
  LevelTile,
  PlatformTile,
  CoinTile,
  EnemyTile,
} from '../components/state/level';

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
  x: number;
  y: number;
  width: number;
  height: number;
}

export type TiledSprite<T, S, Own> = Array<
  {
    sprite: T;
    tile: S;
  } & Own
>;

export type Totems = TiledSprite<
  PIXI.AnimatedSprite,
  EnemyTile,
  { vX: number; vY: number }
>;

export type Water = TiledSprite<PIXI.Sprite, EnemyTile, {}>;

export type Platform = TiledSprite<PIXI.Sprite, PlatformTile, {}>;

export interface WorldObjects {
  size: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  platform: Platform;
  coins: TiledSprite<PIXI.AnimatedSprite, CoinTile, {}>;
  enemies: {
    totems: Totems;
  };
  water: Water;
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
      tiles: LevelTile[];
    };
  };
  camera: Camera;
  character: MovableComponent;
  world: WorldObjects;
}

export interface InitState {
  camera: Camera;
}

const initState = ({ camera }: InitState): GameState => ({
  game: {
    score: 0,
    level: {
      num: 1,
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
  camera,
  world: {
    size: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    platform: [],
    coins: [],
    enemies: {
      totems: [],
    },
    water: [],
    character: {
      x: 0,
      y: 0,
      sprite: new PIXI.Sprite(),
    },
  },
});

export default initState;

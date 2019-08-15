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

export type TiledSprite<T, S> = Array<{
  sprite: T;
  tile: S;
}>;

export interface GameSprites {
  platform: TiledSprite<PIXI.Sprite, PlatformTile>;
  coins: TiledSprite<PIXI.AnimatedSprite, CoinTile>;
  character: PIXI.Sprite;
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
  character: MovableComponent;
  sprites: GameSprites;
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
  sprites: {
    platform: [],
    coins: [],
    character: new PIXI.Sprite(),
  },
});

export default initState;

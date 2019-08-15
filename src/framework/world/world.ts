import * as PIXI from 'pixi.js';
import { GameComponent, GameElement, GameElements } from '../component';

export interface Coords {
  x: number;
  y: number;
}

export interface PointToFollow {
  coords: Coords;
}

export type WorldObject<T> = Coords & T;

export type UpdateChild = (child: PIXI.DisplayObject) => void;

export type CameraFollowFn<GameState> = (state: GameState) => UpdateChild;

export const updateCameraChildren = (
  children: PIXI.DisplayObject[],
  updateChild: UpdateChild
) => {
  children.forEach(updateChild);
};

export const camera = <GameState>(followFn: CameraFollowFn<GameState>) => {
  const container = new PIXI.Container();
  return {
    container,
    updateFn: (state: GameState) => () => {
      const followed = container.children.filter(
        (
          child: PIXI.DisplayObject & {
            __isFixed__: boolean;
            __isFollowed__: boolean;
          }
        ) => !child.__isFixed__ && !child.__isFollowed__
      );
      updateCameraChildren(followed, followFn(state));
    },
  };
};

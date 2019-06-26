import * as PIXI from 'pixi.js';
import { GameComponent, ComponentCommonProps } from '../component';
import { KeyCodes } from '../../constants';
import { GameState } from '../../state';

const Keyboard: GameComponent<ComponentCommonProps, PIXI.Sprite, GameState> = (
  _,
  state
) => {
  Object.keys(KeyCodes).forEach((code: keyof typeof KeyCodes) => {
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.code === code) {
        state.keyboard[code] = false;
      }
    });
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.code === code) {
        state.keyboard[code] = true;
      }
    });
  });

  return {};
};

export default Keyboard;

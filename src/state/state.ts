import { KeyCodes } from '../constants';

export interface GameState {
  character: {
    vX: number;
    jumpTicks: number;
  };
  keyboard: {
    [KeyCodes.Space]: boolean;
    [KeyCodes.ArrowRight]: boolean;
    [KeyCodes.ArrowLeft]: boolean;
  };
}

const initState = (): GameState => ({
  character: {
    vX: 0,
    jumpTicks: 0,
  },
  keyboard: {
    Space: false,
    [KeyCodes.ArrowRight]: false,
    [KeyCodes.ArrowLeft]: false,
  },
});

export default initState;

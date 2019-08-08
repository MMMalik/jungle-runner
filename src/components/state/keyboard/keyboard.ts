import { KeyCodes } from '../../../constants';

export interface KeyboardState {
  Space: boolean;
  ArrowLeft: boolean;
  ArrowRight: boolean;
}

const getKeyboardState = (): () => KeyboardState => {
  const keyboard: KeyboardState = {
    Space: false,
    ArrowRight: false,
    ArrowLeft: false,
  };

  Object.keys(KeyCodes).forEach((code: keyof typeof KeyCodes) => {
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.code === code) {
        keyboard[code] = false;
      }
    });
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.code === code) {
        keyboard[code] = true;
      }
    });
  });

  return () => keyboard;
};

export default getKeyboardState();

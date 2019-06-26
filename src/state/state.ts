export interface GameState {
  character: {
    vX: number;
    jumpTicks: number;
  };
  keyboard: {
    Space: boolean;
    ArrowRight: boolean;
    ArrowLeft: boolean;
  };
}

const initState = (): GameState => ({
  character: {
    vX: 0,
    jumpTicks: 0,
  },
  keyboard: {
    Space: false,
    ArrowRight: false,
    ArrowLeft: false,
  },
});

export default initState;

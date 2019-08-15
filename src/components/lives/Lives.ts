import * as PIXI from 'pixi.js';
import { Textures, JungleRunnerGameStages } from '../../constants';
import { JungleRunnerGameComponent, JungleRunnerRender } from '../../types';

export const render: JungleRunnerRender<PIXI.Sprite> = ({
  state,
  elements,
  initProps,
}) => {
  if (state.character.lives === 0) {
    initProps.nextStage(JungleRunnerGameStages.GameOver);
  }
  if (elements.length > state.character.lives) {
    const toRemove = elements
      .filter(el => !!el.parent)
      .reduce(
        (acc, el, i) => {
          if (i >= state.character.lives) {
            acc.push(el);
          }
          return acc;
        },
        [] as PIXI.Sprite[]
      );
    toRemove.forEach(el => el.parent.removeChild(el));
    initProps.nextStage(JungleRunnerGameStages.NextLevel);
  }
};

const Lives: JungleRunnerGameComponent<PIXI.Sprite> = (_, state) => {
  const resource = PIXI.Loader.shared.resources[Textures.Life];
  const lives = Array.from({ length: state.character.lives }).map((__, i) => {
    const life = new PIXI.Sprite(resource.textures!['life.png']);
    life.anchor.x = 0.5;
    life.anchor.y = 0.5;
    life.position.x = 35 * (i + 1);
    life.position.y = 50;
    return life;
  });

  return {
    render,
    elements: lives,
    isFixed: true,
  };
};

export default Lives;

import * as PIXI from 'pixi.js';

export const debugSprite = (sprites: PIXI.Sprite[]) => {
  return (container: PIXI.Container) => {
    const graphics = new PIXI.Graphics();
    container.addChild(graphics);
    return () => {
      graphics.clear();
      graphics.lineStyle(3, 0xff0000);
      sprites.forEach(sprite => {
        graphics.drawRect(sprite.x, sprite.y, sprite.width, sprite.height);
      });
    };
  };
};

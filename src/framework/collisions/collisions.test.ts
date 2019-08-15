import {
  collide,
  edgesTouchV,
  edgesTouchH,
  willCollideH,
  willCollideY,
} from './collisions';

describe('collisions - utils', () => {
  it('detects collision between two rects', () => {
    const rect1 = {
      x: 0,
      y: 0,
      width: 5,
      height: 2,
    };
    const rect2 = {
      x: 4,
      y: 1,
      width: 2,
      height: 1,
    };
    const twoRectsCollide = collide(rect1, rect2);
    expect(twoRectsCollide).toBe(true);
  });

  it('does not detect collision between two rects if there is none', () => {
    const rect1 = {
      x: 0,
      y: 0,
      width: 5,
      height: 2,
    };
    const rect2 = {
      x: 6,
      y: 3,
      width: 2,
      height: 1,
    };
    const twoRectsCollide = collide(rect1, rect2);
    expect(twoRectsCollide).toBe(false);
  });

  it('does not detect collision between two rects if there is none - edges touch', () => {
    const rect1 = {
      x: 0,
      y: 0,
      width: 5,
      height: 2,
    };
    const rect2 = {
      x: 5,
      y: 2,
      width: 2,
      height: 1,
    };
    const twoRectsCollide = collide(rect1, rect2);
    expect(twoRectsCollide).toBe(false);
  });

  it('detects upcoming horizontal collision between two rects - returns penetration, right', () => {
    const rect1 = {
      x: 0,
      y: 1,
      width: 4,
      height: 2,
    };
    const rect2 = {
      x: 6,
      y: 1,
      width: 5,
      height: 2,
    };
    const resultH = willCollideH(rect1, rect2, 3);
    expect(resultH).toEqual(-1);
  });

  it('detects if edges touch - horizontally', () => {
    const rect1 = {
      x: 0,
      y: 0,
      width: 4,
      height: 2,
    };
    const rect2 = {
      x: 4,
      y: 0,
      width: 4,
      height: 2,
    };
    const rect3 = {
      x: 10,
      y: 0,
      width: 3,
      height: 5,
    };
    const result1 = edgesTouchH(rect1, rect2);
    expect(result1).toBe(true);
    const result1Rev = edgesTouchH(rect2, rect1);
    expect(result1Rev).toBe(true);
    const result2 = edgesTouchH(rect1, rect3);
    expect(result2).toBe(false);
    const result2Rev = edgesTouchH(rect3, rect1);
    expect(result2Rev).toBe(false);
    const result3 = edgesTouchH(rect2, rect3);
    expect(result3).toBe(false);
    const result3Rev = edgesTouchH(rect3, rect2);
    expect(result3Rev).toBe(false);
  });

  it('detects if edges touch - vertically', () => {
    const rect1 = {
      x: 0,
      y: 0,
      width: 4,
      height: 2,
    };
    const rect2 = {
      x: 0,
      y: 2,
      width: 4,
      height: 2,
    };
    const rect3 = {
      x: 0,
      y: 10,
      width: 3,
      height: 5,
    };
    const result1 = edgesTouchV(rect1, rect2);
    expect(result1).toBe(true);
    const result1Rev = edgesTouchV(rect2, rect1);
    expect(result1Rev).toBe(true);
    const result2 = edgesTouchV(rect1, rect3);
    expect(result2).toBe(false);
    const result2Rev = edgesTouchV(rect3, rect1);
    expect(result2Rev).toBe(false);
    const result3 = edgesTouchV(rect2, rect3);
    expect(result3).toBe(false);
    const result3Rev = edgesTouchV(rect3, rect2);
    expect(result3Rev).toBe(false);
  });

  it('detects upcoming horizontal collision between two rects - returns penetration, left', () => {
    const rect1 = {
      x: 430,
      y: 453,
      width: 20,
      height: 35,
    };
    const rect2 = {
      x: 408,
      y: 472,
      width: 16,
      height: 16,
    };
    const resultH = willCollideH(rect1, rect2, -10);
    expect(resultH).toEqual(4);
  });

  it('detects upcoming vertical collision between two rects - returns penetration, top', () => {
    const rect1 = {
      x: 0,
      y: 0,
      width: 4,
      height: 10,
    };
    const rect2 = {
      x: 0,
      y: 11,
      width: 4,
      height: 10,
    };
    const resultV = willCollideY(rect1, rect2, 2);
    expect(resultV).toEqual(-1);
  });

  it('detects upcoming vertical collision between two rects - returns penetration, bottom', () => {
    const rect1 = {
      x: 0,
      y: 11,
      width: 4,
      height: 10,
    };
    const rect2 = {
      x: 0,
      y: 0,
      width: 4,
      height: 10,
    };
    const resultV = willCollideY(rect1, rect2, -2);
    expect(resultV).toEqual(1);
  });
});

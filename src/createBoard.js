import Immutable from 'immutable';

import range from './range';
import shuffle from './shuffle';
// let shuffle = (v) => { return v; };

import GridHelper from './GridHelper';

export default function createBoard (params) {
  let {
    width,
    height,
    mineCount,
    startX = 0,
    startY = 0,
  } = params;

  let grid = GridHelper({
    width: width,
    height: height,
  });
  

  let mines = shuffle(range(0, width*height).map((val, index) => {
    if (index < mineCount) {
      return true;
    }
    return false;
  }));

  let indicesToClear = grid.neighbors8Indices(startX, startY).push(grid.index(startX, startY));

  let clearedCount = 0;
  mines = indicesToClear.reduce((result, idx) => {
    if (result.get(idx) === true) {
      // Swap with the first random safe spot
      clearedCount += 1;
      result = result.set(idx, false);
    }
    return result;
  }, mines);

  mines = shuffle(range(0,width*height).filter((idx) => {
    return mines.get(idx) === false && indicesToClear.indexOf(idx) < 0;
  })).take(clearedCount).reduce((result, idx) => {
    return result.set(idx, true);
  }, mines);

  return Immutable.fromJS({
    width: width,
    height: height,
    mines: mines,
  });
};
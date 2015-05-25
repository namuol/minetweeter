import Immutable from 'immutable';

import range from './range';
import shuffle from './shuffle';

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

  // Swap startX, startY with the first safe spot
  mines = mines.set(grid.index(startX, startY), false)
               .set(mines.indexOf(false), grid.index(startX, startY));

  return Immutable.fromJS({
    width: width,
    height: height,
    mines: mines,
  });
};
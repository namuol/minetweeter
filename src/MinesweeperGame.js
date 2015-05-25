import Immutable from 'immutable';

import GridHelper from './GridHelper';
import createBoard from './createBoard';
import range from './range';

export default function MinesweeperGame (params) {
  let {
    width,
    height,
    mineCount,
    startX,
    startY,
  } = params;

  let {
    xy,
    index,
  } = GridHelper({
    width: width,
    height: height,
  });

  let board = createBoard({
    width: width,
    height: height,
    mineCount: mineCount,
    startX: startX,
    startY: startY,
  });

  let pokes = range(0, width*height).map(() => {
    return false;
  }).set(index(startX, startY), true);
  
  function poke (x, y) {
    pokes = pokes.set(index(startX, startY), true);
    return getGame();
  }

  function getState() {
    return Immutable.Map({
      board: board,
      pokes: pokes,
    });
  }

  function getGame() {
    return {
      poke: poke,
      state: getState(),
    }
  }

  return getGame();
}
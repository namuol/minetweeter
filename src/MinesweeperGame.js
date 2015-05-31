import Immutable from 'immutable';

import GridHelper from './GridHelper';
import createBoard from './createBoard';
import range from './range';

export default function MinesweeperGame (params) {
  let {
    width,
    height,
    mineCount,
  } = params;

  let emptyBoard = createBoard({
    width: width,
    height: height,
    mineCount: 0,
  });

  let {
    xy,
    index,
  } = GridHelper({
    width: width,
    height: height,
  });

  let board = emptyBoard;

  let pokes = range(0, width*height).map(() => {
    return false;
  });
  
  function poke (x, y) {
    if (board == emptyBoard) {
      board = createBoard({
        width: width,
        height: height,
        mineCount: mineCount,
        startX: x,
        startY: y,
      });
    }

    let idx = index(x, y);
    flags = flags.set(idx, false);
    pokes = pokes.set(idx, true);
    return getGame();
  }

  let flags = range(0, width*height).map(() => {
    return false;
  });
  
  function flag (x, y) {
    flags = flags.set(index(x, y), true);
    return getGame();
  }

  function unflag (x, y) {
    flags = flags.set(index(x, y), false);
    return getGame();
  }

  function getState() {
    return Immutable.Map({
      board: board,
      pokes: pokes,
      flags: flags,
      lost: pokes.some((p, idx) => {
        return p && board.get('mines').get(idx);
      }),
      won: flags.every((f, idx) => {
        return f == board.get('mines').get(idx);
      }),
    });
  }

  function getGame() {
    return {
      width: width,
      height: height,
      poke: poke,
      flag: flag,
      unflag: unflag,
      state: getState(),
    };
  }

  return getGame();
}
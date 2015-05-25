import Immutable from 'immutable';
import GridHelper from './GridHelper';
import range from './range';

export default function gameStateToString (state) {
  let board = state.get('board');

  let {
    index,
    xy,
  } = GridHelper({
    width: board.get('width'),
    height: board.get('height'),
  });

  let width = board.get('width');
  let height = board.get('height');

  function countDangerousNeighbors (mines, x, y) {
    return Immutable.List([
      mines.get(index(x, y-1)),   // N
      mines.get(index(x+1, y-1)), // NE
      mines.get(index(x-1, y-1)), // NW
      mines.get(index(x, y+1)),   // S
      mines.get(index(x+1, y+1)), // SE
      mines.get(index(x-1, y+1)), // SW
      mines.get(index(x+1, y)),   // E
      mines.get(index(x-1, y)),   // W
    ]).count((v) => {
      return !!v;
    });
  }

  let mines = board.get('mines');

  return mines.map((isMine, idx) => {
    if (isMine) {
      return '*';
    }

    let count = countDangerousNeighbors(mines, ...xy(idx));
    if (count === 0) {
      return '.';
    } else {
      return count;
    }
  }).reduce((result, char, idx) => {
    let [x, y] = xy(idx);
    
    // if (x === 0) {
    //   result +=  `${y} `;
    // }

    result += char;

    if (x === board.get('width') - 1) {
      result +=  ` ${y}\n`;
    }

    return result;
  }, range(0,width).map((num) => {
    return num;
  }).push('\n\n').join(''));
};
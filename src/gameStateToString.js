import Immutable from 'immutable';
import GridHelper from './GridHelper';
import range from './range';

let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function charify (num) {
  return chars[num];
}

export default function gameStateToString (state) {
  let board = state.get('board');

  let {
    index,
    xy,
    flood,
    neighbors8,
    neighbors4,
    neighbors8Indices,
    neighbors4Indices,
  } = GridHelper({
    width: board.get('width'),
    height: board.get('height'),
  });

  let width = board.get('width');
  let height = board.get('height');

  let pokes = state.get('pokes');

  let mines = board.get('mines');

  let hidden = mines.map((isMine, idx) => {
    if (isMine) {
      return '@';
    }

    let count = neighbors8(mines, ...xy(idx)).count((v) => { return v === true; });

    if (count === 0) {
      return '.';
    } else {
      return count;
    }
  });

  let pokeMask = pokes.reduce((mask, poke, idx) => {
    if (!poke) {
      return mask;
    }

    let [pokeX, pokeY] = xy(idx);

    return flood({
      data: hidden,
      mask: mask,
      x: pokeX, y: pokeY,
      predicate: (params) => {
        let {
          x, y,
          value,
        } = params;

        return value === '.';
      },
    })
  }, pokes);

  pokeMask = pokeMask.map((thisIsPoked, idx) => {
    if (thisIsPoked) {
      return true;
    } 
    
    if (hidden.get(idx) === '.') {
      return false;
    }
    
    return neighbors8Indices(...xy(idx)).some((idx) => {
      return pokeMask.get(idx) && hidden.get(idx) === '.';
    });
  });

  let revealed = hidden.map((char, idx) => {
    if (pokeMask.get(idx)) {
      return char;
    } else {
      return '#';
    }
  });

  function labelify (list) {
    return list.reduce((result, char, idx) => {
      let [x, y] = xy(idx);
      
      // if (x === 0) {
      //   result +=  `${y} `;
      // }

      result += char;

      if (x === board.get('width') - 1) {
        result +=  ` ${charify(y)}\n`;
      }

      return result;
    }, '') + '\n' + range(0,width).map(charify).join('')
  };

  return labelify(revealed) + '\n\n' + labelify(hidden);
};
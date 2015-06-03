import Immutable from 'immutable';
import GridHelper from './GridHelper';
import range from './range';

let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function charify (offset=0) {
  return (num) => {
    return chars[num+offset];
  }
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

  let clicks = state.get('clicks');
  let flags = state.get('flags');

  let lost = state.get('lost');

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

  let revealMask = clicks.reduce((mask, click, idx) => {
    if (!click) {
      return mask;
    }

    let [clickX, clickY] = xy(idx);
    return flood({
      data: hidden,
      mask: mask,
      x: clickX, y: clickY,
      predicate: (params) => {
        let {
          x, y,
          value,
        } = params;

        return value === '.';
      },
    });
  }, clicks).map((val, idx) => {
    return val || clicks.get(idx);
  });

  revealMask = revealMask.reduce((result, thisSpotIsRevealed, idx) => {
    let reveal;

    if (thisSpotIsRevealed) {
      reveal = true;
    } else {
      reveal = neighbors8Indices(...xy(idx)).some((idx) => {
        return revealMask.get(idx) && hidden.get(idx) === '.';
      });
    }

    return result.set(idx, reveal);
  }, revealMask);

  let revealed = hidden.map((char, idx) => {
    if (revealMask.get(idx)) {
      if (mines.get(idx)) {
        return 'X';
      }
      return char;
    } else {
      if (flags.get(idx)) {
        return '^';
      } else if (lost && mines.get(idx)) {
        return '@';
      } else {
        return '=';
      }
    }
  });

  let horizLabel = range(0,width).map(charify(10)).join('');

  function labelify (list) {
    return horizLabel + '\n' + list.reduce((result, char, idx) => {
      let [x, y] = xy(idx);
      
      result += char;

      if (x === board.get('width') - 1) {
        result +=  `${charify(10+width)(y)}\n`;
      }

      return result;
    }, '');
  };

  return labelify(revealed)
  // + '\n\n' + labelify(hidden.map((ch) => {
  //   if (ch === '@' || ch === '.') {
  //     return ch;
  //   }

  //   return ch;
  // }));
};
// import Twit from 'twit';

// let twit = new Twit({
//   consumer_key: process.env.TWIT_CONSUMER_KEY,
//   consumer_secret: process.env.TWIT_CONSUMER_SECRET,
//   access_token: process.env.TWIT_ACCESS_TOKEN,
//   access_token_secret: process.env.TWIT_ACCESS_TOKEN_SECRET,
// });

import MinesweeperGame from './MinesweeperGame';
import toFullWidthString from './toFullWidthString';
import gameStateToString from './gameStateToString';
import range from './range';

range(0,1).forEach(() => {
  let game = MinesweeperGame({
    width: 10,
    height: 9,
    mineCount: 16,
    startX: Math.floor(Math.random()*9),
    startY: Math.floor(Math.random()*9),
  });

  let view = gameStateToString(game.state);

  let actualMineCount = view.split('').reduce((result, ch) => {
    if (ch === '@' || ch === 'X') {
      return result + 1;
    }
    return result;
  }, 0);

  if (actualMineCount !== 16) {
    throw new Error('Wrong number of mines: ' + actualMineCount);
  }

  console.log(toFullWidthString(view) + '\n\n');
});


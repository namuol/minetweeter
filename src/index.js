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

let game = MinesweeperGame({
  width: 6,
  height: 6,
  mineCount: 5,
  startX: Math.floor(Math.random()*6),
  startY: Math.floor(Math.random()*6),
});

console.log(toFullWidthString(gameStateToString(game.state)));
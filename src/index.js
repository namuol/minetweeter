// import twit from './twit';

import MinesweeperGame from './MinesweeperGame';
import toFullWidthString from './toFullWidthString';
import gameStateToString from './gameStateToString';
import range from './range';
import throttle from './throttle';
import parseCommands from './parseCommands';

let game = MinesweeperGame({
  width: 9,
  height: 9,
  mineCount: 10,
});

console.log(toFullWidthString(gameStateToString(game.state)));

// let mentions = twit.stream('statuses/filter', {track: '@minetweeter_'});

let tweetGameBoard = throttle((60*1000)/15, async function (_game) {
  let status = toFullWidthString(gameStateToString(_game.state));
  
  // await twit.post('statuses/update', {
  //   status: status,
  // });

  return status;
});

async function onMention (tweet) {
  let commands = parseCommands({
    status: tweet.status,
    width: game.width,
    height: game.height,
  });

  console.log(commands);
  let previousState = game.state;

  commands.forEach((command) => {
    game = game[command.type](command.x, command.y);
  });

  if (previousState === game.state) {
    // Nothing changed; no need to tweet... or maybe we could tweet a message to the user
    //  that nothing changed?
    console.log('Nothing changed...');
    return;
  }

  try {
    let status = await tweetGameBoard(game);
    
    if (game.state.get('lost')) {
      console.log('You blew it!');
    } else if (game.state.get('won')) {
      console.log('Well done!');
    }
    
    console.log();

    console.log(status);
  } catch (e) {
    console.error('Failed to tweet game board', e);
  }
}

// mentions.on('tweet', onMention);

process.stdin.on('data', (commandText) => {
  onMention({
    status: commandText,
  });
});

// let status;
// while (status = process.stdin.read()) {
//   console.log(status);
//   onMention({
//     status: status,
//   });
// }

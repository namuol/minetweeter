import twit from './twit';

import 'babel/polyfill';

import MinesweeperGame from './MinesweeperGame';
import toFullWidthString from './toFullWidthString';
import gameStateToString from './gameStateToString';
import range from './range';
import throttle from './throttle';
import shuffle from './shuffle';
import parseCommands from './parseCommands';

import Immutable from 'immutable';

let mineCount = 10;

function newGame () {
  return MinesweeperGame({
    width: 9,
    height: 9,
    mineCount: mineCount,
  });
}

let game = newGame();

let mentions = twit.stream('statuses/filter', {track: '@minetweeter_'});

let uniqueMessages = shuffle(Immutable.fromJS([
  'Begin!',
  'New Game!',
  'Okay!',
  'Yup.',
  'Hmm.',
  'Welp.',
  'Heh.',
  'Yeah.',
  'BAM!',
]));

function getUniqueMessage () {
  let msg = uniqueMessages.first();
  uniqueMessages = uniqueMessages.shift().push(msg);
  return msg;
}

async function tweetGameBoard (params) {
  let {
    gameState,
    user,
  } = params;

  let board = toFullWidthString(gameStateToString(gameState));

  let status = board;

  if (gameState.get('new')) {
    status = `${board}\n\n${getUniqueMessage()} ${mineCount} mines remain!`;
  } else if (gameState.get('lost')) {
    status = `${board}\n\nKaboom, @${user}!`;
  } else if (gameState.get('won')) {
    status = `${board}\n\nBravo, @${user}!`;
  }

  await twit.post('statuses/update', {
    status: status,
  });

  return status;
}

async function handleCommandString (params) {
  let {
    game,
    commandString,
    user,
  } = params;

  let commands = parseCommands({
    status: commandString,
    width: game.width,
    height: game.height,
  });

  if (commands.length === 0) {
    // TODO: Tweet at the user "Sorry, I didn't understand that. These are the commands:..."
    twit.post('statuses/update', {
      status: `@${user}\n\n${commandFailedMessage}`,
    });
  }

  commands.forEach((command) => {
    game = game[command.type || 'click'](command.x, command.y);
  });

  return game;
}

let commandFailedMessage =
`Action format:
[click|flag|unflag] x y

You can tweet many actions at once.

Key:
＝ UNKNOWN
． BLANK
＾ FLAG`;

let onMention = throttle(100, async function (tweet) {
  console.log(`Got tweet from ${tweet.user.screen_name}:`, tweet.text);

  let previousState = game.state;

  game = await handleCommandString({
    game: game,
    commandString: tweet.text,
    user: tweet.user.screen_name,
  });

  if (previousState === game.state) {
    // Nothing changed; no need to tweet... or maybe we could tweet a message to the user
    //  that nothing changed?
    return;
  }

  try {
    let status = await tweetGameBoard({
      gameState: game.state,
      user: tweet.user.screen_name,
    });
    
    console.log(status);
  } catch (e) {
    console.error('Failed to tweet game board', e);
  }

  if (game.state.get('lost') || game.state.get('won')) {
    game = newGame();
    onMention.clearQueue();
    try {
      let status = await tweetGameBoard({
        gameState: game.state,
      });

      console.log(status);
    } catch (e) {
      console.error('Failed to tweet game board', e);
    }
  }
});

mentions.on('tweet', onMention);

process.stdin.on('data', (commandText) => {
  onMention({
    user: {
      screen_name: 'louroboros',
    },
    text: commandText,
  });
});

tweetGameBoard({
  gameState: game.state,
}).then((status) => {
  console.log(status);
}, (err) => {
  throw err;
});

import Immutable from 'immutable';

// Matches one or more commands:

let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';


export default function parseCommands (params) {
  let {
    status,
    width,
    height,
  } = params;

  let xChars = chars.slice(0, width);
  let yChars = chars.slice(width, width + height);

  let results = [];

  let matcher = /(^(click|flag|unflag))*((click|flag|unflag)\s+)?([a-z])[\s:,;-]+([a-z])(^(click|flag|unflag))*/ig;

  let matches;
  while (matches = matcher.exec(status)) {
    let firstX = xChars.indexOf(matches[5].toUpperCase());
    let firstY = yChars.indexOf(matches[5].toUpperCase());

    let secondX = xChars.indexOf(matches[6].toUpperCase());
    let secondY = yChars.indexOf(matches[6].toUpperCase());

    let x, y;

    if (firstX > -1 && secondY > -1) {
      x = firstX;
      y = secondY;
    } else if (firstY > -1 && secondX > -1) {
      y = firstY;
      x = secondX;
    } else {
      return false;
    }

    results.push({
      type: (matches[4] || 'click').toLowerCase(),
      x: x,
      y: y,
    });
  }

  return results;
};

let tests = [
  [
    {
      status: `@minetweeter_ click b N`,
      width: 9,
      height: 9,
    },

    [
      {type: 'click', x: 1, y: 4, },
    ],
  ],

  [
    {
      status: `@minetweeter_ click n B`,
      width: 9,
      height: 9,
    },

    [
      {type: 'click', x: 1, y: 4, },
    ],
  ],

  [
    {
      status: `@minetweeter_ flag X X`,
      width: 9,
      height: 9,
    },

    false,
  ],

  [
    {
      status: `@minetweeter_ flag A A`,
      width: 9,
      height: 9,
    },

    false,
  ],

  [
    {
      status: `@minetweeter_ unFLAG n b`,
      width: 9,
      height: 9,
    },

    [
      {type: 'unflag', x: 1, y: 4, },
    ],
  ],

  [
    {
      status: `@minetweeter_ flag a j unflag a j click a j`,
      width: 9,
      height: 9,
    },

    [
      {type: 'flag', x: 0, y: 0, },
      {type: 'unflag', x: 0, y: 0, },
      {type: 'click', x: 0, y: 0, },
    ],
  ],

  [
    {
      status: `@minetweeter_ a j unflag a j click a j`,
      width: 9,
      height: 9,
    },

    [
      {type: 'click', x: 0, y: 0, },
      {type: 'unflag', x: 0, y: 0, },
      {type: 'click', x: 0, y: 0, },
    ],
  ],
];

function deepEquals (a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

tests.forEach((test) => {
  let [input, expectedOutput] = test;

  let actualOutput = parseCommands(input);

  if (!deepEquals(expectedOutput, actualOutput)) {
    let message = `parseCommands test failed.\n\n` +
                  `Input:\n"${input.status}"\n` +
                  `Expected:\n${JSON.stringify(expectedOutput,null,2)}\n\n` +
                  `...but got:\n${JSON.stringify(actualOutput,null,2)}\n\n`;
    throw new Error(message);
  }
});
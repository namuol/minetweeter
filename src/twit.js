import Twit from 'twit';

import twitSettings from '../twitSettings';

let functionsToWrapInPromises = [
  'get',
  'post',
];

let twit = functionsToWrapInPromises.reduce((result, funcName) => {
  let func = result[funcName].bind(result);

  result[funcName] = (...args) => {
    return new Promise (function (resolve, reject) {
      func(...args, (err, data, response) => {
        if (err) {
          return reject(err);
        }

        resolve(data);
      });
    });
  };

  return result;
}, new Twit(twitSettings));

export default twit;

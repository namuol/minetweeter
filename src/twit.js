import Twit from 'twit';
import twitSettings from '../twitSettings';
import throttle from './throttle';

let functionsToWrapInPromises = [
  'get',
  'post',
];

let throttleDelay = (60*1000)/15;

let twit = functionsToWrapInPromises.reduce((result, funcName) => {
  let func = result[funcName].bind(result);

  result[funcName] = throttle(throttleDelay, (...args) => {
    return new Promise (function (resolve, reject) {
      try {
        func(...args, (err, data, response) => {
          if (err) {
            console.error('ugh', err);
            return reject(err);
          }

          resolve(data);
        });
      } catch (err) {
        console.error('unexpected error in twit', err);
        reject (err);
      }
    });
  });

  return result;
}, new Twit(twitSettings));

export default twit;

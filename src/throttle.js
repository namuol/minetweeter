import delay from './delay';
import Immutable from 'immutable';

export default function throttle (ms, func) {
  let q = Immutable.List();

  let awake = false;
  async function awaken () {
    if (awake) {
      return;
    }

    awake = true;
    while (q.size > 0) {
      let {
        resolve,
        reject,
        args,
      } = q.first();

      q = q.shift();

      try {
        resolve(func(...args));
      } catch (e) {
        reject(e);
      }

      await delay(ms);
    }

    awake = false;
  }

  return function (...args) {
    return new Promise(function (resolve, reject) {
      q = q.push({
        resolve: resolve,
        reject: reject,
        args: args,
      });

      awaken();
    });
  };
};
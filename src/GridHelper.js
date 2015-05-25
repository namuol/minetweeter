import Immutable from 'immutable';

export default function GridHelper (params) {
  let {
    width,
    height,
  } = params;

  function xy (idx) {
    let x = idx % width;
    let y = Math.floor(idx / width);
    return [x, y];
  }

  function index (x, y) {
    // if (
    //   x < 0 ||
    //   y < 0 ||
    //   x >= width ||
    //   y >= height
    // ) {
    //   return undefined;
    // }

    return x + (y * width);
  }

  return {
    index: index,
    xy: xy,
  };
};
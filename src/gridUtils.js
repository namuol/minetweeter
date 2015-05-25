import Immutable from 'immutable';

export default function gridHelper (params) {
  let {
    width,
    height,
  } = params;

  function indexToXY (params) {
    let {
      width,
      index,
    } = params;

    let x = index % width;
    let y = Math.floor(index / width);
    return [x, y];
  }

  function xyToIndex (params) {
    let {
      width,
      x,
      y,
    } = params;

    return x + (y * width);
  }

  return {
    indexToXY: indexToXY,
    xyToIndex: xyToIndex,
  };
};
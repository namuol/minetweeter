import Immutable from 'immutable';
import range from './range';

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

  function neighbors4Indices (x, y) {
    return Immutable.List([
      index(x, y-1), // N
      index(x, y+1), // S
      index(x+1, y), // E
      index(x-1, y), // W
    ]);
  }

  function neighbors4 (list, x, y) {
    return neighbors4Indices(x, y).map((idx) => {
      return list.get(idx);
    });
  }

  function neighbors8Indices (x, y) {
    return Immutable.List([
      index(x, y-1),   // N
      index(x+1, y-1), // NE
      index(x-1, y-1), // NW
      index(x, y+1),   // S
      index(x+1, y+1), // SE
      index(x-1, y+1), // SW
      index(x+1, y),   // E
      index(x-1, y),   // W
    ]);
  }

  function neighbors8 (list, x, y) {
    return neighbors8Indices(x, y).map((idx) => {
      return list.get(idx);
    });
  }

  function index (x, y) {
    if (
      x < 0 ||
      y < 0 ||
      x >= width ||
      y >= height
    ) {
      return undefined;
    }

    return x + (y * width);
  }

  function flood (params) {
    let {
      data,
      predicate,
      mask = range(0, width*height).map(() => {return false;}),
    } = params;

    let processed = range(0, width*height).map(() => {return false;});

    let queue = Immutable.List();

    queue = queue.push([params.x, params.y]);
    let count = 0;
    while (queue.size > 0) {
      count += 1;

      let [x,y] = queue.first();
      let idx = index(x,y);

      queue = queue.shift();
      
      if (processed.get(idx)) {
        continue;
      }

      processed = processed.set(idx, true);

      if (!predicate({
        data: data,
        x: x, y: y,
        value: data.get(idx),
      })) {
        continue;
      }
      
      mask = mask.set(idx, true);

      neighbors8Indices(x, y).filter((idx) => {
        return !processed.get(idx);
      }).forEach((idx) => {
        queue = queue.push(xy(idx));
      });
    }

    return mask;
  }

  return {
    flood: flood,
    index: index,
    xy: xy,
    neighbors4Indices: neighbors4Indices,
    neighbors8Indices: neighbors8Indices,
    neighbors4: neighbors4,
    neighbors8: neighbors8,
  };
};

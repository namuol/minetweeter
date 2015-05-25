import Immutable from 'immutable';

export default function range (start, end) {
  return Immutable.List(Immutable.Range(start, end));
};
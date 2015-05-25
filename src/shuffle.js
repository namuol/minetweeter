export default function shuffle (list) {
  return list.reduce((result, currentValue, currentIndex) => {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    let otherValue = result.get(randomIndex);
    
    return result.set(randomIndex, currentValue).set(currentIndex, otherValue);
  }, list);
};
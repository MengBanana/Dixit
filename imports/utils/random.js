var shuffle = require("shuffle-array");

export function random(cards, players) {
  shuffle(cards);
  let allInHand = [];
  let allDistributed = [];
  let res = [];

  for (let i=0; i<players; i++) {
    let cardsInHand = [];
    let cardsDistributed =[]; 
    for (let j=0; j<12; j++) {
      if (j % 2 === 0) {
        cardsInHand.push(cards[i*12+j]);
      }
      else {
        cardsDistributed.push(cards[i*12+j]);
      }
    }
    allInHand.push(cardsInHand);
    allDistributed.push(cardsDistributed);
  }
  res.push(allInHand);
  res.push(allDistributed);
  return res; // array of arrays
}
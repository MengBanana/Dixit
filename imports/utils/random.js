export function random(cards, players) {
  const totalCards = players*players*2;
  let allInHand = [];
  let allDistributed = [];
  let res = [];
  let cardsPerPerson = totalCards/players;

  for (let i=0; i<players; i++) {
    let cardsInHand = [];
    let cardsDistributed =[]; 
    for (let j=0; j<cardsPerPerson; j++) {
      if (j % 2 === 0) {
        cardsInHand.push(cards[i*cardsPerPerson+j]);
      }
      else {
        cardsDistributed.push(cards[i*cardsPerPerson+j]);
      }
    }
    if (Math.random() < 0.5) {
      allInHand.push(cardsInHand);
      allDistributed.push(cardsDistributed);
    }
    else {
      allInHand.push(cardsDistributed);
      allDistributed.push(cardsInHand);
    }
  }
  if (Math.random() < 0.5) {
    res.push(allInHand);
    res.push(allDistributed);
  }
  else {
    res.push(allDistributed);
    res.push(allInHand);
  }
  return res; // array of arrays
}
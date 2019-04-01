export function random(cards, players) {
  const totalCards = players*players*2;
  let res = [];
  let cardsPerPerson = totalCards/players;

  for (let i=0; i<players; i++) {
    let distributedCards = [];
    for (let j=0; j<cardsPerPerson; j++) {
      distributedCards.push(cards[i*cardsPerPerson+j]);
    }
    res.push(distributedCards);
  }
  return res; // array of arrays
}
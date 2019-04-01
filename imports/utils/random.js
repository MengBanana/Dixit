export function random(cards, players) {
  const totalCards = players*players*2;
  let res = [];
  let cardsPerPerson = totalCards/players;

  for (let i=0; i<players; i++) {
    let distributedCards = cards.slice(i*cardsPerPerson, (i+1)*cardsPerPerson);
    res.push(distributedCards);
  }
  return res; // array of arrays
}
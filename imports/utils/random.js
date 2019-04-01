export function random(cards) {
	const length = cards.length;
	let res = [];
	for (let i=0; i<=71; i++) {
		let c = Math.floor(Math.random() * Math.floor(length)); // 0-length
		while (res.contains(cards[c]._id)) {
			c = Math.floor(Math.random() * Math.floor(length)); // 0-length
		}
		res.push(cards[c]._id);
	}
	return res; // array of pic ids
}
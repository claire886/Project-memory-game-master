/*
 * Create a list that holds all of your cards
 */

const initialCards = ['fa fa-paper-plane-o', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-anchor',
					 'fa fa-leaf', 'fa fa-leaf', 'fa fa-bicycle',  'fa fa-bicycle',
					 'fa fa-diamond', 'fa fa-diamond', 'fa fa-bomb', 'fa fa-bomb',
					 'fa fa-bolt', 'fa fa-bolt', 'fa fa-cube', 'fa fa-cube'];

newGame();


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function newGame() {
	let shuffledCards = shuffle(initialCards);
	let deckCardHtml = '';
	const deckUl = document.querySelector('.deck');

	shuffledCards.forEach(function(card) {
		deckCardHtml += `<li class="card"><i class="${card}"></i></li>`;
	})

	deckUl.innerHTML = deckCardHtml;
}



// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

const deckClick = document.querySelector('.deck');
let openCardArray = [];
deckClick.addEventListener('click', function(e) {
	const target = e.target;
console.log(target.parentElement, openCardArray);
	/* event listener only response if the card is folded */
	if (target.parentElement.classList.value === 'card') {
		target.parentElement.classList.add('open', 'show');
		openCardArray.push(target);
		if (openCardArray.length === 2) {		
			const [card_1, card_2] = openCardArray;
			setTimeout(function() {matchOrNot(card_1, card_2)}, 1000);
		}
	}	
})

function matchOrNot(a, b) {
	if (a.classList.value === b.classList.value) {
console.log('same');
				a.parentElement.classList.add('match');
				b.parentElement.classList.add('match');
				a.parentElement.classList.remove('open', 'show');
				b.parentElement.classList.remove('open', 'show');
			} else {
console.log('different');
				a.parentElement.classList.remove('open', 'show');
				b.parentElement.classList.remove('open', 'show');
}
	openCardArray = [];

}

/*
* set up event listener for restart the game
*  -if user click the restart sign, all the cards will be folded and shuffled
*/

const restartDiv = document.querySelector('.restart');
restartDiv.addEventListener('click', newGame);
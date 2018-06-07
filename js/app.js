/*
 * Create a list that holds all of your cards
 */

const cardSymbol = ['fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-leaf', 'fa fa-bicycle',
					'fa fa-diamond', 'fa fa-bomb', 'fa fa-bolt', 'fa fa-cube'];
const initialCards = cardSymbol.concat(cardSymbol);

let moves = 0;	// count of moves
let matchCount = 0;	// count pairs of match
const movesEl = document.querySelector('.moves');	
const starsEl = document.querySelector('.stars');
let timePassed = 0;
let myTimer;
const timerEl = document.querySelector('.timer');
const congratModalEl = document.querySelector('.congrat-modal'); /* showing congratulation model when gmae is completed */

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
	const deckEl = document.querySelector('.deck');

	// initial rating: three stars
	initialStars();
	
	// setting cards for a new game
	shuffledCards.forEach(function(card) {
		deckCardHtml += `<li class="card"><i class="${card}"></i></li>`;
	})
	deckEl.innerHTML = deckCardHtml;
}

/*
* set up event listener for restart the game
*  -if user click the restart sign, all the cards will be folded and shuffled
*/
const restartDiv = document.querySelector('.restart');
restartDiv.addEventListener('click', resetGame);

// display 3 stars in score panel 
function initialStars() {	
	let starsHtml = '';
	for (i = 0; i < 3; i++) {
		starsHtml += '<li><i class="fa fa-star"></i></li>';
	}
	starsEl.innerHTML = starsHtml;
}

// reset game or play again
function resetGame() {
	newGame();
	moves = 0;
	matchCount = 0;
	timePassed = 0;
	starCount = 0;
	openCardArray = [];
	movesEl.textContent = moves;
	timerEl.textContent = timePassed;
	congratModalEl.style.display = 'none';
	clearInterval(myTimer);
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

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

const deckClickEl = document.querySelector('.deck');
let openCardArray = [];	// put cards that are open and waiting for checking into this array
let startTime;	// for recording starting time
let starCount = 0;	// count of stars reduced

deckClickEl.addEventListener('click', function(e) {
	const target = e.target;
	// event listener only response if the card is folded, which means the class only has a attribute value of 'card'
	if (target.parentElement.classList.value === 'card' && openCardArray.length < 2) {
		moves++;
		// recode the time when first move occurred
		if (moves === 1) {
			startTime = new Date();
			myTimer = setInterval(timer, 1000); // time passed in seconds after starting the game
		}
		// when move count reaches 27 or 35, one star is substracted from rating stars
		if (moves === 27 || moves === 35) {
			starCount++;			
			starsRating();
		}

		movesEl.textContent = moves;	// update moves used in score panel
		target.parentElement.classList.add('open', 'show'); // mark clicked card as open and show
		openCardArray.push(target);
		// if two card are in opened card array, check if they are mateched
		if (openCardArray.length === 2) {
			const [card_1, card_2] = openCardArray;
			// dealy 0.4 sec to excute match function, otherwise the cards would looks like never opened when they are not matched
			setTimeout(function() {matchOrNot(card_1, card_2)}, 400);	 
		}
	}	
})

// display how many seconds passed in score panel
function timer() {
	timePassed++;
	timerEl.textContent = timePassed;
}

// remove a star from score panel
function starsRating() {
	starsEl.removeChild(starsEl.firstChild);
}

// checking if the cards in open array are matched
function matchOrNot(a, b) {
	if (a.classList.value === b.classList.value) {
		matchCount++;	
		a.parentElement.classList.add('match');
		b.parentElement.classList.add('match');
		a.parentElement.classList.remove('open', 'show');
		b.parentElement.classList.remove('open', 'show');
		// if all 8 pairs of cards are matched: 1. record time to calculate how much time is used 2. display congratulation modal
		if (matchCount === 8) {
			const time = timeUsed();
			clearInterval(myTimer);
			congrats(timePassed);			
		}	
	} else {
		a.parentElement.classList.remove('open', 'show');
		b.parentElement.classList.remove('open', 'show');
}
	openCardArray = [];
}

// calculate how much time is used to finish the game
function timeUsed() {
	const endTime = new Date();
	const timeSeconds = (endTime - startTime) / 1000;
	return timeSeconds.toFixed(2);
}

// build and display congratulation modal
function congrats(t) {
	let modalHtml = '';
	// give different comment according to the number of star the user got
	const starComment = ['Your are superb!', 'You are brilliant!', 'You are great!'];
	// calculate how many stars the user got
	let starResult = ((3 - starCount) > 1) ? (3 - starCount) + ' stars' : (3 - starCount) + ' star';
	let comment = `Congratulation! You completed the game in ${t} seconds and ${moves} moves. You got ${starResult}. ${starComment[starCount]}`;
	// build innerHTML for modal section
	modalHtml = `<div class='result'><p>${comment}</p><button class='close'>Close</button><button class='newGame'>Play Again</button></div>`
	congratModalEl.innerHTML = modalHtml;
	// button for play agin
	const newGameButton = document.querySelector('.newGame');
	newGameButton.addEventListener('click', resetGame);
	// button for close congratulation modal
	const closeButton = document.querySelector('.close');
	closeButton.addEventListener('click', close);
	// showing congratulation modal
	congratModalEl.style.display = 'flex';
}

// when close button is clicked, congratulation modal will be gone
function close() {
	congratModalEl.style.display = 'none';	
}


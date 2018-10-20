/*
 * Create a list that holds all of your cards
 *  cards are mapped to these characters.
 *  like fa-diamond == 'a' etc.
 */
var orginalCards = ['a', 'a', 'b', 'b', 'c', 'c', 'd', 'd', 'e', 'e', 'f', 'f', 'g', 'g', 'h', 'h'];
var intialCount = 0;
var min = 0;
var sec = 0;
var hours = 0;
var letsStop = 0;
var timer;

/*
 * The timer method to display the time it took to play the game.
 */
function initTimer() {
    timer = setInterval(function () {
        if (letsStop !== 1) {
            sec++;
            if (sec === 60) {
                min++;
                sec = 0;
            }
            if (min === 60) {
                hours++;
                min = 0;
                sec = 0;
            }
            var span = document.querySelector(".timer");
            if (span) {
                span.innerText = hours + ':' + min + ':' + sec;
            }
        }
    }, 1000);
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
 *  Create a new star
 */
function createStar() {
    var star = document.createElement("li");
    var iElement = document.createElement("i");
    iElement.setAttribute("class", "fa fa-star")
    star.appendChild(iElement);
    return star;
}

/*
 * Reset stars and the count of the number of moves and the timer.
 */
function starAndCountReset() {
    // Reset intial Count
    intialCount = 0;

    // Reset Timer.
    var span = document.querySelector(".timer");
    if (span) {
        span.innerText = "0";
    }

    // Reset Moves.
    var moves = document.querySelector(".moves");
    if (moves) {
        moves.textContent = 0;
    }

    // Delete any stars
    var li = document.querySelectorAll(".fa.fa-star");
    li.forEach((element) => {
        element.parentElement.remove();
    });
    
    // Timer reset.
    hours = 0;
    min = 0;
    sec = 0;
    letsStop = 0;
    clearInterval(timer);
    initTimer();

    // Re create stars
    var stars = document.getElementsByClassName("stars");

    if (stars[0] && stars[0].children.length <= 3) {
        stars[0].appendChild(createStar());
        stars[0].appendChild(createStar());
        stars[0].appendChild(createStar());
    }
}

/*
 * Display modal dialog message that the game is over and stop the game timer.
 */
function displayFinishedGameMessage() {
    var openedCards = document.querySelectorAll(".card.show.animated.match");
    if (openedCards.length == 16) {
        letsStop = 1;
        clearInterval(timer);
        // The delay should be greater than flipping the cards or else it will show message before matched card state.
        setTimeout(function () {            
            document.getElementById("finish").showModal(); 
        }, 100);
    } else {
        console.log("playmore");
    }
}

/*
 * EventListener when you click the card. This will also support animation.
 */
function playGame(event) {
    intialCount++;

    var moves = document.querySelector(".moves");
    // Set the counter text.
    if (moves) {
        moves.textContent = intialCount;
    }

    // Remove the star based on number of moves.
    // Moves < 20 - 3 stars.
    // Moves >= 20 - 2 stars.
    // Moves >= 25 - 1 star.
    // Moves >= 30 - 0 stars.
    if (intialCount == 30 || intialCount == 25 || intialCount == 20) {
        var li = document.querySelector(".fa.fa-star");
        li.remove();
    }
    var eleTarget = event.currentTarget;
    var eleOpened = document.querySelector(".deck .card.open.show");
    if (!eleOpened) {
        // New card opened.
        eleTarget.setAttribute("class", "card show open");
        eleTarget.removeEventListener('click', playGame);
    } else {
        var elementTobeMatched = eleOpened.firstElementChild;
        if (eleTarget.firstElementChild.getAttribute("class") === elementTobeMatched.getAttribute("class")) {
            // Cards are matched.
            eleOpened.setAttribute("class", "card show animated match");
            eleTarget.setAttribute("class", "card show animated match");
            eleTarget.removeEventListener('click', playGame);
            eleOpened.removeEventListener('click', playGame);
            displayFinishedGameMessage();
        } else {
            // Cards were not matched.
            eleTarget.addEventListener('click', playGame);
            eleOpened.addEventListener('click', playGame);
            eleTarget.setAttribute("class", "card show open");
            eleOpened.setAttribute("class", "card show open");

            // Adding some delay to flip the cards.
            setTimeout(function () {
                eleTarget.setAttribute("class", "card");
                eleOpened.setAttribute("class", "card");
            }, 50);
        }
    }
}

/*
 * Initalize the game.
 */
function init() {
    // Star reset
    starAndCountReset();
    // Shuffle the cards.
    var shuffleCards = shuffle(orginalCards);

    var htmlCards = document.querySelectorAll(".deck .card");

    // Flip to hide all cards.
    htmlCards.forEach((element, index) => {
        element.removeAttribute("class");
        const child = element.firstElementChild;
        child.removeAttribute("class");
        switch (shuffleCards[index]) {
            case 'a':
                child.setAttribute("class", "fa fa-diamond");
                break;
            case 'b':
                child.setAttribute("class", "fa fa-bicycle");
                break;
            case 'c':
                child.setAttribute("class", "fa fa-leaf");
                break;
            case 'd':
                child.setAttribute("class", "fa fa-anchor");
                break;
            case 'e':
                child.setAttribute("class", "fa fa-bomb");
                break;
            case 'f':
                child.setAttribute("class", "fa fa-cube");
                break;
            case 'g':
                child.setAttribute("class", "fa fa-paper-plane-o");
                break;
            case 'h':
                child.setAttribute("class", "fa fa-bolt");
                break;
            default:
        }
        element.setAttribute("class", "card");

        // Bind the click event listener to each card
        element.addEventListener('click', playGame);
    });
}

var restart = document.getElementById("restart");
if (restart) {
    // Bind click to restart element
    restart.addEventListener('click', init);
}

init();


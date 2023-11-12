const wordList = ["table","chair","desktop","light", "orange", "grape", "melon", "peach", "plum",  "lemon", "pear", "apricot","backrogund","document","chrome","launch","problem","terminal","console","style"];

let selectedWord = "";
let wordDisplay = [];
let revealedLetters = [];
let incorrectAttempts = 0;
const maxIncorrectAttempts = 5;
let time = 0;
let timerId;

function hang(n) {
    var pom = document.getElementById("hang-image");
    switch (n) {
        case 1: pom.src = "telo.png"; break;
        case 2: pom.src = "lraka.png"; break;
        case 3: pom.src = "draka.png"; break;
        case 4: pom.src = "lnoga.png"; break;
        case 5: pom.src = "dnoga.png"; break;
        default: pom.src = "besilka.png"; break;
    }
}
function initializeWordDisplay(word) 
{
    const revealedLetters = [];

    while (revealedLetters.length < 3) {
        const randomIndex = Math.floor(Math.random() * word.length);
        const randomLetter = word[randomIndex];
        revealedLetters.push(randomLetter);
    }

    const initialDisplay = word.split('').map((letter, index) => {
        return revealedLetters.includes(letter) ? letter : '_';
    });

    return { initialDisplay, revealedLetters };
}

function startNewGame() {
    time = 0;
    document.getElementById("hang-image").src = "besilka.png";

    selectedWord = getRandomWord();
    const { initialDisplay, revealedLetters: initialRevealedLetters } = initializeWordDisplay(selectedWord);
    wordDisplay = initialDisplay;
    revealedLetters = initialRevealedLetters;
    incorrectAttempts = 0;
    updateWordDisplay();
    updateAttemptsDisplay();
    startTimer();
}

function startTimer() {
    clearTimeout(timerId);
    const elem = document.getElementById('counter');
    function countup() {
        elem.innerHTML = time + ' seconds ';
        time++;
        if (time > 30) {
            clearTimeout(timerId);
            alert("Your time is up!");
            updateWordDisplay();
            updateAttemptsDisplay();
            showResultPopup("Time's up! You couldn't guess the word in time.", false);
            startNewGame();
        }
    }
    timerId = setInterval(countup, 1000);
    countup();
}

function getRandomWord() {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

function checkGuess() {
    const guessInput = document.getElementById("guess-input");
    const guess = guessInput.value.toLowerCase();

    if (guess.length !== 1 || !/[a-z]/.test(guess)) {
        alert("Enter a valid letter.");
        return;
    }

    if (selectedWord.includes(guess) && !revealedLetters.includes(guess)) {
        for (let i = 0; i < selectedWord.length; i++) {
            if (guess === selectedWord[i]) {
                wordDisplay[i] = guess;
            }
        }
        revealedLetters.push(guess);
    } else if (!selectedWord.includes(guess)) {
        incorrectAttempts++;
        alert("Wrong letter.");
        hang(incorrectAttempts);
    }

    guessInput.value = "";
    updateWordDisplay();
    updateAttemptsDisplay();

    if (wordDisplay.join("") === selectedWord) {
        showResultPopup(`You guessed the word! 🎉, ${selectedWord}`, true);
    } else if (incorrectAttempts >= maxIncorrectAttempts) {
        showResultPopup(`You couldn't guess the word. The correct word was: ${selectedWord}`, false);
    }
}

function updateWordDisplay() {
    const wordDisplayElement = document.getElementById("word-display");
    wordDisplayElement.textContent = wordDisplay.join(" ");
}

function showResultPopup(message, success) {
    const resultPopup = document.createElement("div");
    resultPopup.className = "result-popup";

    const resultMessage = document.createElement("div");
    resultMessage.textContent = message;

    const newGameButton = document.createElement("button");
    newGameButton.textContent = "New Game";
    newGameButton.onclick = function () {
        resultPopup.remove();
        startNewGame();
    };

    resultPopup.appendChild(resultMessage);
    resultPopup.appendChild(newGameButton);

    document.body.appendChild(resultPopup);
}

function updateAttemptsDisplay() {
    const attemptsCountElement = document.getElementById("attempts-count");
    attemptsCountElement.textContent = incorrectAttempts;
}

window.addEventListener("load", startNewGame);
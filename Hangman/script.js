document.addEventListener("DOMContentLoaded", () => {
    const wordContainer = document.querySelector(".word-container");
    const wrongGuessesDisplay = document.querySelector(".wrong-guesses b");
    const keyboardContainer = document.querySelector(".keyboard-container");
    const hangmanImage = document.querySelector(".hangman-container img");
    const gameOverlay = document.querySelector(".game-overlay");
    const restartBtn = gameOverlay.querySelector("button");

    let currentWord, correctGuesses, wrongGuessCount;
    const maxWrongGuesses = 6;

    const initializeGame = () => {
        correctGuesses = [];
        wrongGuessCount = 0;
        hangmanImage.src = "images/hangman-0.svg";
        wrongGuessesDisplay.textContent = `${wrongGuessCount} / ${maxWrongGuesses}`;
        wordContainer.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
        keyboardContainer.querySelectorAll("button").forEach(button => button.disabled = false);
        gameOverlay.classList.remove("visible");
    };

    const selectRandomWord = () => {
        const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
        currentWord = word.toLowerCase();
        document.querySelector(".hint b").textContent = hint;
        initializeGame();
    };

    const showGameOver = (isVictory) => {
        const message = isVictory ? `You found the word:` : 'The correct word was:';
        gameOverlay.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
        gameOverlay.querySelector("h4").textContent = isVictory ? 'Congratulations!' : 'Game Over!';
        gameOverlay.querySelector("p").innerHTML = `${message} <b>${currentWord}</b>`;
        gameOverlay.classList.add("visible");
    };

    const handleLetter = (letter) => {
        if (currentWord.includes(letter)) {
            [...currentWord].forEach((char, index) => {
                if (char === letter) {
                    correctGuesses.push(letter);
                    const letters = wordContainer.querySelectorAll("li");
                    letters[index].textContent = letter.toUpperCase();
                    letters[index].classList.add("revealed");
                }
            });
        } else {
            wrongGuessCount++;
            hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
        }
        wrongGuessesDisplay.textContent = `${wrongGuessCount} / ${maxWrongGuesses}`;

        if (wrongGuessCount === maxWrongGuesses) return showGameOver(false);
        if (correctGuesses.length === currentWord.length) return showGameOver(true);
    };

    const handleButtonClick = (button, letter) => {
        handleLetter(letter.toLowerCase());
        button.disabled = true;
        button.classList.add("clicked");
    };

    const handleKeyPress = (event) => {
        const key = event.key.toLowerCase();
        if (/^[a-z]$/.test(key)) {
            const button = keyboardContainer.querySelector(`button[data-letter="${key}"]`);
            if (button && !button.disabled) {
                handleButtonClick(button, key);
            }
        }
    };

    for (let i = 97; i <= 122; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement("button");
        button.textContent = letter.toUpperCase();
        button.dataset.letter = letter;
        keyboardContainer.appendChild(button);
        button.addEventListener("click", () => handleButtonClick(button, letter));
    }

    selectRandomWord();
    restartBtn.addEventListener("click", selectRandomWord);
    document.addEventListener("keypress", handleKeyPress);
});

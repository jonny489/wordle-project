
let currentRow = 0; //0 to 5
let currentTile = 0 //0 to 4
let currentGuess = [];
let isGameOver = false;
let word = '';
let tiles = [];

async function loadWords() {
       // 1. 'fetch' the file. 'await' pauses the function until the file is loaded.
    const response = await fetch('words.txt');
    
    // 2. Get the text content from the response. We 'await' this too.
    const text = await response.text();
    
    // 3. Split the giant string of text into an array, using the newline character ('\n') as the separator.
    const wordArray = text.split('\n');
    
    // 4. Return the final array of words.
    return wordArray;
}
function chooseWord(list) {
    index = Math.floor(Math.random()*list.length);
    return list[index];
}


function fillBoard(){
    const elem = document.getElementById("game-board");
    for (let i=0; i< 30;i++) {
        let box=document.createElement('div');
        box.classList.add('tile');
        box.addEventListener('click', handleTileClick)
        elem.appendChild(box);
    }
}


function handleTileClick() {
    console.log("A tile was clicked!");
  }

//data key is more specific

const popupContainer = document.getElementById("popup-container");
const playAgainButton = document.querySelector(".playagain");
const popupText = document.getElementById('popup-message')

function handleKeyboardClick(event){
    if(isGameOver) return;
    // The 'event.target' property is the specific button element that was clicked.
    const clickedKeyElement = event.target;
    const keyValue = clickedKeyElement.dataset.key;

    let tileIndex = currentRow *5+currentTile;
    if (keyValue.length ===1 && currentTile < 5) {
        const currentTileElement = tiles[tileIndex];
        currentTileElement.textContent = keyValue;
        currentTile += 1;
        currentGuess.push(keyValue);
        return;
    }

    if (keyValue === 'enter'){
        if(currentTile === 5) {
            console.log("submitting guess:", currentGuess.join(""));
            const guessString = currentGuess.join("");
            const results = checkGuess(currentGuess.join(''), word);
            const startTileIndex = currentRow * 5;
            for (let i = 0; i< 5; i++){
                const tile = tiles[startTileIndex + i];
                const status = results[i];
                tile.classList.add(status);
            }
            if (guessString===word){
                isGameOver = true;
                console.log("You win! Congrats!");
                popupContainer.style.display = "flex";
                popupText.textContent = "You so sigma! You won! The word was: " + word;
                playAgainButton.addEventListener("click", () => {
                    location.reload();
                })
                return;
            }
            currentTile = 0;
            currentRow++;
            if (currentRow===6){
                isGameOver = true;
                console.log("Game over! You lost!")
                popupContainer.style.display = "flex";
                popupText.textContent = "Unfortunately you are not so sigma...you won lost! The word was: " + word;
                playAgainButton.addEventListener("click", () => {
                    location.reload();
                })
                return;
            }
            currentGuess = [];
        } else {
            console.log("Word is not long enough!");
        }
        return;
    }
    if(keyValue === 'backspace') {
        if (currentTile > 0){
            currentTile--;
            currentGuess.pop();
            let tileIndex = currentRow * 5 + currentTile;
            const currentTileElement = tiles[tileIndex];
            currentTileElement.textContent = "";
        }
    }
}

function handleKeyPress(event) {
    if(isGameOver) return;
    
    const key = event.key.toLowerCase();
    
    // Handle letter keys (a-z)
    if (key.length === 1 && key >= 'a' && key <= 'z' && currentTile < 5) {
        let tileIndex = currentRow * 5 + currentTile;
        const currentTileElement = tiles[tileIndex];
        currentTileElement.textContent = key;
        currentTile += 1;
        currentGuess.push(key);
        return;
    }
    
    // Handle Enter key
    if (key === 'enter') {
        if(currentTile === 5) {
            console.log("submitting guess:", currentGuess.join(""));
            const guessString = currentGuess.join("");
            const results = checkGuess(currentGuess.join(''), word);
            const startTileIndex = currentRow * 5;
            for (let i = 0; i< 5; i++){
                const tile = tiles[startTileIndex + i];
                const status = results[i];
                tile.classList.add(status);
            }
            if (guessString===word){
                isGameOver = true;
                console.log("You win! Congrats!");
                popupContainer.style.display = "flex";
                popupText.textContent = "You so sigma! You won! The word was: " + word;
                playAgainButton.addEventListener("click", () => {
                    location.reload();
                })
                return;
            }
            currentTile = 0;
            currentRow++;
            if (currentRow===6){
                isGameOver = true;
                console.log("Game over! You lost!")
                popupContainer.style.display = "flex";
                popupText.textContent = "Unfortunately you are not so sigma...you won lost! The word was: " + word;
                playAgainButton.addEventListener("click", () => {
                    location.reload();
                })
                return;
            }
            currentGuess = [];
        } else {
            console.log("Word is not long enough!");
        }
        return;
    }
    
    // Handle Backspace key
    if (key === 'backspace') {
        if (currentTile > 0){
            currentTile--;
            currentGuess.pop();
            let tileIndex = currentRow * 5 + currentTile;
            const currentTileElement = tiles[tileIndex];
            currentTileElement.textContent = "";
        }
    }
}

function checkGuess(guessWord, targetWord) {
    const results = []; // This will store our results ['correct', 'present', 'absent']
    const targetLetters = targetWord.split(''); // Turn the target word into an array of letters we can modify

    // --- PASS 1: Check for GREENS (correct letter, correct position) ---
    for (let i = 0; i < 5; i++) {
        if (guessWord[i] === targetLetters[i]) {
            results[i] = 'correct';
            // Mark this letter as "used" so it can't be matched again for a yellow.
            targetLetters[i] = null; 
        }
    }

    // --- PASS 2: Check for YELLOWS and GRAYS ---
    for (let i = 0; i < 5; i++) {
        // If we already marked this letter as correct, skip it.
        if (results[i] === 'correct') {
            continue;
        }

        // Is the guessed letter present anywhere else in the target word?
        if (targetLetters.includes(guessWord[i])) {
            results[i] = 'present';
            // Mark this letter as "used" so it doesn't get matched again.
            // (e.g., for a guess like "SASSY" against "PASTY")
            targetLetters[targetLetters.indexOf(guessWord[i])] = null;
        } else {
            // If it's not correct and not present, it must be absent.
            results[i] = 'absent';
        }
    }

    return results; // The function's final report!
}

async function startGame() {
    console.log("Game is starting...");
    const loadedWords = await loadWords();
    console.log("Words loaded successfully!");

    // 1. Choose the word for the game.
    word = chooseWord(loadedWords);
    console.log("Target Word:", word); // For debugging

    // 2. Create the HTML tiles on the page.
    fillBoard();

    // 3. Get a reference to all the tiles AFTER they have been created.
    // We re-assign the global `tiles` variable here.
    tiles = document.querySelectorAll('.tile');

    // 4. Set up the keyboard listeners.
    const keys = document.querySelectorAll('button[data-key]');
    for (const key of keys) {
        key.addEventListener('click', handleKeyboardClick);
    }
    
    // 5. Set up physical keyboard listener
    document.addEventListener('keydown', handleKeyPress);
}

// --- KICK EVERYTHING OFF ---
// This should be the ONLY function call in the global part of your script.
startGame();
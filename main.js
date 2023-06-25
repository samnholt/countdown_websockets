// Flow of sections 
// Times up appears three seconds after submitting the answer
// Times up also stays submitting the answer
// 
//

function startGame(socket, startGameButton, vowelsSection) {
    startGameButton.addEventListener('click', () => {
        let event = {
            "type": "start_game"
        };
        socket.send(JSON.stringify(event));
        startGameButton.style.display = 'none';
        vowelsSection.style.display = 'block';
});
};


function sendVowels(socket, vowelsCountInput) {
    const vowelsButton = document.getElementById('sendVowels')
    vowelsButton.addEventListener('click', () => {
        let vowelsCount = parseInt(vowelsCountInput.value);
        if (isNaN(vowelsCount) || vowelsCount < 3 || vowelsCount > 5) {
            alert('Please enter a number between 3 and 5.');
            return;
        }
        let event = {
            type: 'display',
            vowels_chosen: vowelsCount,
        };
    
        socket.send(JSON.stringify(event));
        
    })

};


function displayMessage(socket, postGuessMessageElement) {
    socket.addEventListener("message", ({ data }) => {
        const event = JSON.parse(data);
        if (event.type == "score") {
            postGuessMessageElement.textContent = `${event.text}`
        };
        if (event.type == "display") {
            postGuessMessageElement.style.display = 'none'
        };
    })
}


function receiveLetters(socket, letterStringElement, gameSection, timerElement, roundNumberElement, guessedWordInput) {
    socket.addEventListener("message", ({ data }) => {
        const event = JSON.parse(data);
        if (event.type == "send_letters") {
            letterStringElement.textContent = event.letters;
            gameSection.style.display = 'block';
            roundNumberElement.textContent = `Round ${event.round_number}/6`;

            let timerId = startTimer(socket, guessedWordInput);
            startTimer(timerElement, gameSection);
        }
    });
}

function sendGuess(socket, guessedWordInput, submitGuessButton, timerId, postGuessMessageElement, gameSection) {
    submitGuessButton.addEventListener('click', () => {
        let guessedWord = guessedWordInput.value.trim();
        if (!guessedWord) {
            alert('Please enter a word.');
            return;
        }
        let event = {
            type: 'submitGuess',
            guessed_word: guessedWord,
        };
        socket.send(JSON.stringify(event));
        clearInterval(timerId);
        endRound(socket, gameSection, postGuessMessageElement, guessedWordInput);
    });
}

function startTimer(timerElement, gameSection) {
    let countdown = 30; // in seconds
    // Set countdown timer and start it
    // if a guess is sent, end the timer
    let timerId = setInterval(() => {
        countdown--;
        timerElement.textContent = countdown + " seconds remaining";
        if (countdown <= 0) {
            clearInterval(timerId);
            endRound(socket, gameSection)
        }
    }, 1000);
}

function processScore(socket, scoreDisplay, vowelsCountInput, nextRoundButton) {
    socket.addEventListener("message", ({ data }) => {
        const event = JSON.parse(data);
        switch (event.type) {
            case "score":
                let round_score = event.round_score;
                let game_score = event.game_score;
                scoreDisplay.textContent = `Your round score: ${round_score} | Your total score: ${game_score}`;
                break;
            case "invalid":
                scoreDisplay.textContent = `${event.text}`
                break;
                };
            });
        };

function endRound (socket, gameSection, postGuessMessageElement, guessedWordInput) {
    gameSection.style.display = 'none';
    postGuessMessageElement.style.display = 'block';
    let event = {
        "type": "end_round",
    };
    socket.send(JSON.stringify(event));
    guessedWordInput.value = '';
}

function endGame (socket, endTitleElement, endElement, playElement) {
    socket.addEventListener("message", ({ data }) => {
        const event = JSON.parse(data);
        if (event.type == "score" && event.round_number == "6") {
            playElement.style.display = 'none';
            endElement.style.display = 'block';
            endTitleElement.textContent = `Final score: ${event.game_score}`
        }
    })
}


document.addEventListener('DOMContentLoaded', (event) => {
    const startButton = document.getElementById('startButton');
    const vowelsCountInput = document.getElementById('vowelsCount');
    const gameSection = document.getElementById('gameSection');
    const letterStringElement = document.getElementById('letterString');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const guessedWordInput = document.getElementById('guessedWord');
    const submitGuessButton = document.getElementById('submitGuessButton');
    const vowelsSection = document.getElementById('vowels');
    const startGameButton = document.getElementById('startGame');
    const timerElement = document.getElementById('timer');
    const nextRoundButton = document.getElementById('nextRoundButton');
    const RoundNumberElement = document.getElementById('roundNumber');
    const postGuessMessageElement = document.getElementById('postGuessMessage');
    const endElement = document.getElementById('end');
    const endTitleElement = document.getElementById('endTitle');
    const playElement = document.getElementById('play')


    if(window.WebSocket) {
        const socket = new WebSocket('ws://localhost:8001');
        socket.onopen = () => {
            console.log('Connected to the server.');
            let event = {
                "type": "init"
            }
            socket.send(JSON.stringify(event))
            startGame(socket, startGameButton, vowelsSection);
            sendVowels(socket, vowelsCountInput)
            receiveLetters(socket, letterStringElement, gameSection, timerElement, RoundNumberElement);
            sendGuess(socket, guessedWordInput, submitGuessButton, postGuessMessageElement, gameSection);
            processScore(socket, scoreDisplay, vowelsCountInput, nextRoundButton);
            displayMessage(socket, postGuessMessageElement);
            endGame(socket, endTitleElement, endElement, playElement) ;
        };
        socket.onerror = (error) => {
            console.log('WebSocket Error: ', error);
        };
        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };
    } else {
        alert('Your browser does not support WebSockets.');
    }
});

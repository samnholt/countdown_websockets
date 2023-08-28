import React, {useCallback, useRef} from 'react';
import { useState } from 'react';
import useWebSocket from "react-use-websocket";

import logo from './logo.svg';
import './App.css';

const WS_URL = 'ws://0.0.0.0:8001'

function App() {

  useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WS Connected!')
    }
  });

  return (
    <div className="App">
        <TitleSection />
        <Game />
    </div>
  );
}


function Game() {
    return (
        <>
            <StartButton />
            <SetVowels />
            <Play />
            <CountdownTimer />
            <Score />
        </>
    )
}

function Play() {
    return (
        <>
        <Letters />
        <Guess />
        </>
    )
}

function TitleSection () {
    return <h1>Countdown Game!</h1>
}

function StartButton() {
    const { sendJsonMessage } = useWebSocket(WS_URL, {share: true})
    const handleClickStartGame = useCallback(() => sendJsonMessage(
        {
            'type': 'start_game'
        }), []);

    return <button onClick={handleClickStartGame}>Start Game</button>
}

function SetVowels() {

    const inputRef = useRef(null);
    const { sendJsonMessage } = useWebSocket(WS_URL, {share: true})

    const handleClick = () => {
        sendJsonMessage({
            'type': 'display',
            'vowels_chosen': parseInt(inputRef.current.value)
        })
    }

    return (
        <>
            <label>
                Enter chosen amount of Vowels:
                <input ref={inputRef}></input>
                <button id="sendVowels" onClick={handleClick}>Submit Vowels</button>
            </label>
        </>
    )
}


function Letters() {
    const { lastJsonMessage } = useWebSocket(WS_URL, {share: true})

    let letters = lastJsonMessage?.letters || '';

    return (
        <>
            <h2>Your letters: <p>{letters}</p></h2>
            <p id="letterString"></p>
        </>
    )
}

function Guess() {
    const inputRef = useRef(null);
    const { sendJsonMessage } = useWebSocket(WS_URL, {share: true})

    const handleClick = () => {
        sendJsonMessage({
            type: 'submitGuess',
            guessed_word: inputRef.current.value,
        })
    }
    return (
        <>
            <label htmlFor="guessedWord">Enter your guess:
                <input type="text" id="guessedWord" ref={inputRef}></input>
                <button id="submitGuessButton" onClick={handleClick}>Submit Guess</button>
            </label>
        </>
    )
}

function CountdownTimer() {
    return (
        <>
        <h3>Time left:</h3>
        </>
    )
}

function Score () {
    return <h3>Your score:</h3>
}


export default App;

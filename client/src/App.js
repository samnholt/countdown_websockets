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
            <Vowels />
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

function Vowels() {

    const inputRef = useRef(null);
    const { sendJsonMessage } = useWebSocket(WS_URL, {share: true})


    const handleClick = () => {
        // setUpdated(inputRef.current.value);
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
    return (
        <>
            <h2>Your letters:</h2>
            <p id="letterString"></p>
        </>
    )
}

function Guess() {
    return (
        <>
            <label htmlFor="guessedWord">Enter your guess:</label>
            <input type="text" id="guessedWord"></input>
            <button id="submitGuessButton">Submit Guess</button>
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

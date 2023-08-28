import React from 'react';
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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

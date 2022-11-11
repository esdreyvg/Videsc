import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Box } from "@mui/material";
import PlayList from "./components/playlist";

function App() {

  return (
    <Box className="App">
      <Box className='App-header'>
        <img src={logo} className="App-logo" alt="logo" width={150} />
        <p>{"Plataforma para Descargar Videos de Youtube"}</p>
      </Box>
      <Box>
        <PlayList />
      </Box>
    </Box>
  );
}

export default App;

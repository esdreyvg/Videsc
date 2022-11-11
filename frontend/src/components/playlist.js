import React, {useState} from "react";
import './playlist.css';
import { Box, FormControl, TextField} from "@mui/material";
import { backend } from "./../middleware/backend";

export default function PlayList() {
    const handlesubmit = (data) => {
        if (data) {
            console.log(data);            
        }
        return alert("vacio");
    };
    return(
        <Box component={"form"} className='App-body' onSubmit={handlesubmit}>
          <p>{"Si desea descargar un vídeo, ingrese la url de youtube"}</p>
          <FormControl>
            <label htmlFor="link">{"Ingrese la url: "}</label>
            <TextField type={"text"} variant={"outlined"} name={"link"} id={"link"} className="App-text" fullWidth />
          </FormControl>
          <p>{"Si desea descargar varios vídeos, ingrese la playlist de youtube"}</p>
          <FormControl>
            <label htmlFor="playlist">{"Ingrese la playlist: "}</label>
            <TextField type={"text"} variant={"outlined"} name={"playlist"} id={"playlist"} className="App-text" fullWidth />
          </FormControl>
          <br />
          <FormControl>
            <TextField type={"submit"} value={"Descargar"} className="App-text" />
          </FormControl>
        </Box>
    );
}
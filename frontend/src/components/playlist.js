import React, {useState} from "react";
import './playlist.css';
import { backend } from "./../middleware/backend";

export default function PlayList() {
  const [inputValue, setInputValue] = useState('');
  const [playListValue, setPlayListValue] = useState('');
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  const handlePlayListChange = (event) => {
    setPlayListValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputValue) {
      const title = info.title.substring(0, 25);
      const paramsBody = {
        url: inputValue,
        title: title
      };
      setLoading(true);
      try {
        backend.post('/download', paramsBody).then((response) => {
          setLoading(false);
          if (response.data.code === 0) {
            setShowModal(true);
            setTimeout(() => setShowModal(false), 3000);
          } else {
            throw response.data.data;
          }
        });
      } catch (error) {
        setLoading(false);
        setError('Se produje un error en la descarga, intente nuevamente');
        console.error(error);
      }
    }
    else if (playListValue) {
      const paramsBody = {
        url: playListValue
      };
      try {
        backend.post('/playlist', paramsBody).then((response) => {
          setLoading(false);
          if (response.code === 0) {
            setShowModal(true);
            setTimeout(() => setShowModal(false), 3000);
          } else {
            throw response.data;
          }
        });
      } catch (error) {
        setLoading(false);
        setError('Se produje un error en la descarga, intente nuevamente');
        console.error(error);
      }      
    } else {
      alert('Por favor, ingresa una URL o PlayList.');
    }
  };
  const getInfoVideo = async() => {
    setLoading(true);
    setError(null);
    setInfo(null);
    const paramsBody = { url: inputValue };
    try {
      const { data } = await backend.post('/info', paramsBody);
      setLoading(false);
      if (data.code === 0) {
        setInfo(data.data);        
      } else {
        throw data.message;
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      setError('Se produje un error al obtener la información, intente nuevamente!');
    }
  };
  return(
    <div className="App-body">
      <form>
        <label>
          URL:
          <input type="text" value={inputValue} onChange={handleChange} />
        </label>
        <br />
        <label>
          PlayList:
          <input type="text" value={playListValue} onChange={handlePlayListChange} />
        </label>
        <br />
        <button type="button" onClick={getInfoVideo}>Info</button>
      </form>
      {loading && <div className="loading">Cargando...</div>} {/* Cargando */}
      {showModal && (
          <div className="modal">
            <h2>Descarga Completada</h2>
            <p>La descarga se completó con éxito.</p>
          </div>
        )}
      {info && (
          <div className="info-box">
            <h2>Información del Video:</h2>
            <p><strong>Título:</strong> {info.title}</p>
            <p><strong>Privado para descarga:</strong> {info.private ? 'Sí' : 'No'}</p>
            {
              info.private ? <button type="button" onClick={handleSubmit}>Descargar</button> : null
            }
            <button type="button" onClick={handleSubmit}>Descargar</button>
            <p><strong>Calidades Disponibles:</strong></p>
            <ul>
              {info.quality.map((q, index) => (
                <li key={index}>{q}</li>
              ))}
            </ul>
          </div>
        )}
      {error && (
        <div className="error-box">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}
    </div>        
  );
}
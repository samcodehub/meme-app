import React from "react";
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import "./Meme.css";

export default function Meme() {
  const [meme, setMeme] = React.useState({
    topText: "",
    bottomText: "",
    topTextX: "50",
    bottomTextX: "50",
    topTextY: "5",
    bottomTextY: "85",
    changePosition: false,
    randomImage: "http://i.imgflip.com/1bij.jpg",
  });

  const [allMemes, setAllMemes] = React.useState([]);

  React.useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((response) => response.json())
      .then((data) => {
        setAllMemes(data.data.memes.filter((meme) => meme.box_count === 2));
      });
  }, []);

  function getMemeImage() {
    const randomNumber = Math.floor(Math.random() * allMemes.length);
    const url = allMemes[randomNumber].url;
    setMeme((prevMeme) => {
      return {
        ...prevMeme,
        randomImage: url,
      };
    });
  }



  function handleChange(event) {
    const { name, value, checked, type } = event.target;
    setMeme((prevMeme) => {
      return {
        ...prevMeme,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }

  function topStyle() {
    if (meme.changePosition)
      return {
        left: meme.topTextX + "%",
        top: meme.topTextY + "%",
      };
    else
      return {
        left: "50%",
        top: "5%",
      };
  }

  function botStyle() {
    if (meme.changePosition)
      return {
        left: meme.bottomTextX + "%",
        top: meme.bottomTextY + "%",
      };
    else
      return {
        left: "50%",
        top: "85%",
      };
  }

 
  

  const descargarMeme = () => {
    htmlToImage.toJpeg(document.getElementById('exportarImg'), { quality: 0.95 })
    .then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = 'meme.jpeg';
      link.href = dataUrl;
      link.click();
    });
}

  

  return (
    <main>
      <div
        className="form"
        style={
          meme.changePosition
            ? { gridTemplate: "40px 20px 5px 20px 5px 20px 40px/ 1fr 1fr" }
            : { gridTemplate: "40px 20px 40px/ 1fr 1fr" }
        }
      >
        <input
          type="text"
          placeholder="Texto superior"
          className="form--input"
          name="topText"
          value={meme.topText}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Texto inferior"
          className="form--input"
          name="bottomText"
          value={meme.bottomText}
          onChange={handleChange}
        />
        <div className="form--checkbox">
          <input
            type="checkbox"
            id="position"
            name="changePosition"
            checked={meme.changePosition}
            onChange={handleChange}
          />
          <label htmlFor="position">Cambiar la posición del texto</label>
        </div>
        {meme.changePosition && <span>Texto Superior X: {meme.topTextX}</span>}
        {meme.changePosition && <span>Texto Inferior X: {meme.bottomTextX}</span>}
        {meme.changePosition && (
          <input
            type="range"
            min="1"
            max="100"
            name="topTextX"
            value={meme.topTextX}
            onChange={handleChange}
          />
        )}
        {meme.changePosition && (
          <input
            type="range"
            min="1"
            max="100"
            name="bottomTextX"
            value={meme.bottomTextX}
            onChange={handleChange}
          />
        )}
        {meme.changePosition && <span>Texto Superior Y: {meme.topTextY}</span>}
        {meme.changePosition && <span>Texto Inferior Y: {meme.bottomTextY}</span>}
        {meme.changePosition && (
          <input
            type="range"
            min="1"
            max="100"
            name="topTextY"
            value={meme.topTextY}
            onChange={handleChange}
          />
        )}
        {meme.changePosition && (
          <input
            type="range"
            min="1"
            max="100"
            name="bottomTextY"
            value={meme.bottomTextY}
            onChange={handleChange}
          />
        )}
        <button className="form--button" onClick={getMemeImage}>
        Obtener una nueva imagen de meme 🖼
        </button>
      </div>
      <div className="meme" id="exportarImg">
        <img src={meme.randomImage} alt="memeImg"  className="meme--image" />
        <h1 className="meme--text" style={topStyle()}>
          {meme.topText}
        </h1>
        <h2 className="meme--text" style={botStyle()}>
          {meme.bottomText}
        </h2>
        
      </div>
      <button onClick={descargarMeme} type="button" id="descargar" >Descargar</button>
    </main>
  );
}

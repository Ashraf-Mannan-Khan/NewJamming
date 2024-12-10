import React, { useState } from 'react';
import styles from "./jamming.module.css";


function App() {
  const [name, setName] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [addSong, setAddSong] = useState([]);
  const [input, setInput] = useState('');
  const [title, setTitle] = useState('');
  const [song, setSong] = useState({})
  const [toggle, setToggle] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  

  function handleSubmit() {
    
   
    setSong((prev) => {return {
      ...prev, song: addSong
    }});
    
    console.log(song.song.length === 0);
    if(title !== '' && song.song.length !== 0) {
      setPlaylistName(title);
      setToggle(true);
      setAddSong([]);
      setTitle('');
    } else {
      
      setToggle(false);
    }
    
  }


  function addPlay(i) {
    setAddSong((prev) => {
      if (prev.includes(playlist[i])) {
        return [...prev];
      } else {
        return [playlist[i], ...prev]
      }
    });
  }



  function removePlay(i) {
    setAddSong(addSong.filter((item, index) => index !== i));
  }


  const track = addSong.map((song, index) => {
    return (
      <div style={{
      
        display: "flex",
      alignItems: "center",
     justifyContent: "space-between"
      }}>
        <div style={{marginRight:20}}>
          <ul>
            <li key={index} style={{ fontFamily: "cursive" }}>
              {song}
            </li>
            <hr ></hr>
            <li style={{
              fontFamily: "cursive",
              fontSize: "small"

            }}>
              {name}
            </li>
          </ul>
        </div>
        <div style={{ marginLeft: 10 }}><button onClick={() => removePlay(index)} className={styles.plusButton}style={{marginLeft:20}} >-</button></div>

      </div>
    )
  });

  const Song = async (event) => {
    event.preventDefault();

    const url = `https://spotify23.p.rapidapi.com/search/?q=${input}&type=tracks&offset=0&limit=10&numberOfTopResults=5`;

    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '15196b2134msha154160161c7b77p1f66c0jsn0acdab18522f',
        'x-rapidapi-host': 'spotify23.p.rapidapi.com'
      }
    }
    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const jsonResponse = await response.json();
        const query = jsonResponse.query;

        const res = jsonResponse.tracks.items;
        setName(query.replace('+', " "));
        if (playlist.length < 10) {
          for (let i = 0; i < Math.min(res.length, 10); i++) {
            setPlaylist((prev) => {
              return [res[i].data.name, ...prev];
            }
            )

          }
        }


      }
    } catch (error) {
      console.log(error);
    }
    setInput('');
  }


  return (
    <>
   
      <div className={styles.heading}><h1>Jamming</h1>
      </div>

      <div className={styles.searchContainer} >
        <input type='search' id="input" onChange={
          ({ target }) => {
            setInput(target.value);
          }
        } value={input} className={styles.inputBar} />
        <button onClick={Song} className={styles.searchButton} > Search</button>
      </div >
      <div className={styles.box}>

        <div className={styles.box1}>

          <h2 style={{
            fontFamily: "monospace",
            marginBottom: 5
          }}>Results</h2>
          {playlist.map((tracks, index) => {
            return (
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: 'nowrap'
              }}>
                <div >
                  <ul>
                    <li style={{ fontFamily: "cursive" }}>{tracks}</li>
                    <hr ></hr>
                    <li style={{
                      fontFamily: "cursive",
                      fontSize: "small"

                    }} >{name}</li>
                  </ul>
                </div>

                <div style={{ marginLeft: 10 }}>
                  <button onClick={() => addPlay(index)} className={styles.plusButton}>+</button>
                </div>

              </div>

            )
          })}

        </div>
        <div className={styles.box2}>
          <div style={{marginBottom:5}}>
          <input type="text" value={title} className={styles.input2} onChange={
          ({ target }) => {
            setTitle(target.value);

          }
        }/>
          </div>
          <div style={{marginBottom:5}}>
          {track}
          </div>
          <div>
          <button type='submit' onClick={handleSubmit} className={styles.searchButton} style={{ marginTop: 10 }} >Save Playlist</button>
          </div>
          
          
        </div>

        <div className={styles.savedtrack}>
          <div className={styles.savedtrackcont}>
            <div>
            {toggle && <h3>{playlistName}</h3>}
            </div>
            
            <div>
            {toggle && !showPlaylist ? < button onClick={() => setShowPlaylist(true)} className={styles.savedtrackButton}>+</button> : null}
            {toggle && showPlaylist && < button onClick={() => 
            setShowPlaylist(false)}
             className={styles.savedtrackButton} >-</button>}
            </div>


            
          </div>

          <div>
            {showPlaylist && toggle &&
              <ul className={styles.ul}>
                {song.song.map(song => <li>{song}</li>)}
                
              </ul>
             }
          </div>
        </div>

      </div>





    </>
  );


}

export default App;

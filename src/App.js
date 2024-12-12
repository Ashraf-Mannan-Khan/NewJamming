import React, { useState } from 'react';
import styles from "./jamming.module.css";


function App() {
  const [name, setName] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [addSong, setAddSong] = useState([]);
  const [input, setInput] = useState('');
  const [title, setTitle] = useState('');
  const [song, setSong] = useState({song:[]})
  const [toggle, setToggle] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [singerName, setSingerName] = useState('');

  

  function handleSubmit() {
    
   
    setSong((prev) => {return {
      ...prev, song: addSong
    }});
    
 
    
    if(title !== '' && song.song.length !== 0 ) {
      setPlaylistName(title);
      setToggle(true);
      setAddSong([]);
      setTitle('');
    } else {
      
      return
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
      <div className={styles.innerBoxTwo} >
        <div >
          <ul>
            <li key={index}>
              {song}
            </li>
            <hr ></hr>
            <li >
              {singerName}
            </li>
          </ul>
        </div>
        <div ><button onClick={() => removePlay(index)} className={styles.plusButton} >-</button></div>

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
        console.log(jsonResponse);
        const query = jsonResponse.query;
        const artist = jsonResponse.tracks.items[0].data.artists.items[0].profile.name;
        const res = jsonResponse.tracks.items;
        console.log(artist);
        setSingerName(artist);
        console.log(res);
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

        <div className={styles.firstbox}>

          <h2 >Results</h2>
          {playlist.map((tracks, index) => {
            return (
              <div className={styles.innerBoxOne}>
                <div >
                  <ul>
                    <li >{tracks}</li>
                    <hr ></hr>
                    <li >{singerName}</li>
                  </ul>
                </div>

                <div >
                  <button onClick={() => addPlay(index)} className={styles.plusButton}>+</button>
                </div>

              </div>

            )
          })}

        </div>
        <div className={styles.secondbox}>
          <div >
          <input type="text" value={title} className={styles.input2} onChange={
          ({ target }) => {
            setTitle(target.value);

          }
        }/>
          </div>
          <div >
          {track}
          </div>
          <div>
          <button type='submit' onClick={handleSubmit} className={styles.savePlaylistButton}  >Save Playlist</button>
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

          <div className={styles.lastchild}>
            {showPlaylist && toggle &&
              <ul >
                {song.song.map((song,index) => <li className={styles.liststyle} key={index}>{song}</li>)}
                
              </ul>
             }
          </div>
        </div>

      </div>





    </>
  );


}

export default App;

import React, { useState } from 'react';
import styles from "./jamming.module.css";


function App() {

  const [playlistName, setPlaylistName] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [addSong, setAddSong] = useState([]);
  const [input, setInput] = useState('');
  const [title, setTitle] = useState('');
  const [song, setSong] = useState({song:[]})
  const [toggle, setToggle] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [singerName, setSingerName] = useState('');
  const [url, setUrl] = useState([]);
  const [loadingOn,setLoadingOn] = useState(false);
  const [loadingOff,setLoadingOff] = useState(false);

  const [info, setInfo] = useState({
    heading: '',
    song: [],
  });




  function handleSubmit() {
    
   setInfo((prev) => {
    return {
      
      
      ...prev,
      heading: title,
      song : addSong,
     
    }
   });
    setSong((prev) => {return {
      ...prev, song: addSong
    }});
    
 
    
    if(title.length !==0 && song.song.length !== 0 ) {
      setPlaylistName(title);
      setToggle(true);
      setAddSong([]);
      setTitle('');
      setLoadingOn(true);
      setLoadingOff(false);
    } else {

    setToggle(false);
    return;
    }
   setTimeout(()=> {
    setLoadingOn(false);
    setLoadingOff(true);
   },2000);
   

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
      <>
      <div className={styles.innerBoxTwo} >
        <div >
          <ul>
            <li key={index}>
              {song}
            </li>
            
            <li >
              {singerName}
            </li>
          </ul>
        </div>
        <div ><button onClick={() => removePlay(index)} className={styles.plusButton} >-</button></div>

      </div>
      
      </>
    )
  });

  const savedPlaylist = (     
  <div className={styles.savedtrack}>
    <div className={styles.savedtrackcont}>
    <div>
    {toggle && <h3>{info.heading}</h3>}
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
          {info.song.map((song,index) => <li className={styles.liststyle} key={index}>{song}</li>)}
          
        </ul>
       }
    </div>
  </div> );

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
      
        setSingerName(artist);
        const songUrl = res[0].data.albumOfTrack.sharingInfo.shareUrl;
        console.log(songUrl);
           if (playlist.length < 10) {
          for (let i = 0; i < Math.min(res.length, 10); i++) {
            setPlaylist((prev) => {
              return [res[i].data.name, ...prev];
            }
            )
            setUrl((prev )=> {
              return [res[i].data.albumOfTrack.sharingInfo.shareUrl, ...prev]

            });
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
              <>
              <div className={styles.innerBoxOne}>
                <div className={styles.bottomBorder}>
                  <ul>
                    <li >{tracks}</li>
                  
                    <li >{singerName}</li>
                   <li>
                    <audio src={url[0]} />
                   </li>
                  </ul>
                </div>

                <div >
                  <button onClick={() => addPlay(index)} className={styles.plusButton}>+</button>
                </div>

              </div>
              <hr></hr>
              </>
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
       
        {loadingOn ? <p>Paylist Being Saved....</p>: null}
        {loadingOff ? savedPlaylist: null}
      </div>





    </>
  );


}

export default App;

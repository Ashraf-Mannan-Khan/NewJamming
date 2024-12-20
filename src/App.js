import React, { useState, useEffect } from 'react';
import styles from "./jamming.module.css";


const clientId = '27e5a678ded9406f9eac4d869726a110'; // Replace with your Client ID
const clientSecret = 'd1a8e945d82c44df84ad6faa7a7f713b';// Replace with your Client Secret
const redirectUri = "https://amkprojects.netlify.app/callback"; // Replace with your redirect URI
const scopes = "user-read-private user-read-email user-library-read";


function App() {

  const [playlistName, setPlaylistName] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [addSong, setAddSong] = useState([]);
  const [input, setInput] = useState('');
  const [title, setTitle] = useState('');
  const [song, setSong] = useState({ song: [] })
  const [toggle, setToggle] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
   const [singerName, setSingerName] = useState('');

  const [visble, setVisble] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newSong, setNewSong] = useState([]);
  const [Login, SetLogin] = useState(false);


  const [info, setInfo] = useState(() => {
    const saved = localStorage.getItem('savedPlaylist',);
    return saved ? JSON.parse(saved) : {
      heading: '',
      song: [],
    }
  });


  const [accessToken, setAccessToken] = useState(localStorage.getItem('authToken') || '');
  const [refreshToken, setRefreshToken] = useState('');


  const [expirationTime, setExpirationTime] = useState(0);




  function handleSubmit() {

    setInfo(prev => {
      return {
        ...prev,
        heading: title,
        song: addSong,

      }
    });

    setSong((prev) => {
      return {
        ...prev, song: addSong
      }
    });





    if (title.length !== 0 && song.song.length !== 0) {
      setLoading(true);

      setPlaylistName(title);
      setToggle(true);

      setAddSong([]);
      setTitle('');
      setVisble(false);
      setPlaylist([]);
      localStorage.setItem('savedPlaylist', JSON.stringify(info));
    } else {

      setToggle(false);
      return;
    }


    setTimeout(() => {

      setVisble(true);
    }, 1000);

    setTimeout(() => {

      setLoading(false);
    }, 3000);




    console.log(info);
  }



  useEffect(() => {
    setVisble(true);
    setToggle(true);
    setShowPlaylist(true);
    setInput(localStorage.getItem('searchTerm'));

    console.log(info);

  }, [])



  function addPlay(i) {
    setAddSong((prev) => {
      if (prev.includes(newSong[i])) {
        return [...prev];
      } else {
        return [newSong[i], ...prev]
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
            {info.song.map((song, index) => <li className={styles.liststyle} key={index}>{song}</li>)}

          </ul>
        }
      </div>
    </div>);


  const handleLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    window.location.href = authUrl;

  };
  // const handleLogout = () => {
  //   setAccessToken('');
  //   localStorage.removeItem('authToken');
  //   SetLogin(true);
  // };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetchAccessToken(code);
    }

  }, [accessToken]);

  const fetchAccessToken = async (code) => {
    const url = "https://accounts.spotify.com/api/token";
    const bodyParams = new URLSearchParams({
      grant_type: "authorization_code",
      code: code, // Authorization code from URL
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",

      },
      body: bodyParams.toString(),
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error(`Failed to fetch access token: ${response.status}`, errorDetails);
        return;
      }
      const data = await response.json();
      if (data.access_token) {
        setAccessToken(data.access_token);
        localStorage.setItem('authToken', data.access_token);
      } else {
        console.log('Login failed');
      }
      console.log("Token response data:", data);

      // setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setExpirationTime(Date.now() + data.expires_in * 1000);
      scheduleTokenRefresh(data.expires_in - 60);
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  };


  const refreshAccessToken = async () => {
    try {
      const url = "https://accounts.spotify.com/api/token";

      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: clientId
        }),
      }
      const response = await fetch(url, payload);
      const data = await response.json();
      setAccessToken(data.access_token);
      setExpirationTime(Date.now() + data.expires_in * 1000);

      scheduleTokenRefresh(expirationTime - 60);
    } catch (error) {
      console.log(error);
    }
  }

  const scheduleTokenRefresh = (delayInSeconds) => {
    setTimeout(() => {
      refreshAccessToken();
    }, delayInSeconds * 1000);
  };



  const Song = async (event) => {
    event.preventDefault();
    localStorage.setItem('searchTerm', input);
    const url = `https://api.spotify.com/v1/search?q=${input}&type=track&include_external=audio&limit=20`;


    const authorizationSearch = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Fixed incorrect 'applications/json' to 'application/json'
        "Authorization": `Bearer ${accessToken}` // Added a space after 'Bearer' and used template literals for clarity
      }
    };

    try {
      const res = await fetch(url, authorizationSearch);

      console.log()

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json(); // Awaited the response JSON parsing
      console.log(data.tracks.items.length);
      for (let i = 0; i < data.tracks.items.length; i++) {
        setPlaylist(prev => [data.tracks.items[i].name, ...prev]);
      }
      setNewSong(playlist.filter(s => !info.song.some(val => val === s)));





      // console.log(playlist.filter(s => info.song.every(val => val !== s)));
      // console.log(data.tracks.items);
    } catch (error) {
      console.error('Error fetching song:', error);
    }


  }


  return (
    <>

      <div className={styles.heading}><h1>Jamming</h1>
        {!Login && <button onClick={handleLogin}>Login to spotify</button>}
       

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
          {newSong.slice(0, 10).map((tracks, index) => {
            return (
              <>
                <div className={styles.innerBoxOne}>
                  <div className={styles.bottomBorder}>
                    <ul>
                      <li >{tracks}</li>

                      <li >{singerName}</li>
                      <li>

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
            } />
          </div>
          <div >
            {track}
          </div>
          <div>
            <button type='submit' onClick={handleSubmit} className={styles.savePlaylistButton}  >Save Playlist</button>
          </div>


        </div>
        {visble && <div>
          {loading ? <p>Paylist Being Saved....</p> : savedPlaylist}
        </div>}



      </div>





    </>
  );


}

export default App;

import React, { useState, useEffect } from "react";
// import styles from "./jamming.module.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import PlaylistContainer from "./components/PlaylistContainer";
import styles from "../src/components/jammingNew.module.css";
export const clientId = "27e5a678ded9406f9eac4d869726a110";

function App() {
  // States
  let playlistId = "";
  let uris = [];
  const [playlistName, setPlaylistName] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [addSong, setAddSong] = useState([]);
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");
  const [song, setSong] = useState({ song: [] });
  const [toggle, setToggle] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [singerName, setSingerName] = useState([]);
  const [userId, setUserId] = useState('');
  const [visble, setVisble] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newSong, setNewSong] = useState([]);
  const [display, setDisplay] = useState(false);
  let filterSong = [];

  

  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("spotifyAccessToken") || ""
  );
  const [refreshToken, setRefreshToken] = useState("");

  const [expirationTime, setExpirationTime] = useState(0);

  // Hooks

  useEffect(() => {
    
   
    setInput(localStorage.getItem("searchTerm"));
   
    
   

  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");

    if (accessToken) {
      setAccessToken(accessToken);
      localStorage.setItem("spotifyAccessToken", accessToken);
      window.location.hash = ""; // Clear token from URL
    } else {
      const storedToken = localStorage.getItem("spotifyAccessToken");
      if (storedToken) {
        setAccessToken(storedToken);
      }
    }
  }, [accessToken]);

  // Functions

  function handleSubmit() {
   
    uris =  addSong.map(items => items.uri);
    

    const getUserId = async () => {
      const url = "https://api.spotify.com/v1/me";
      const authorizationSearch = {
        method: "GET",
        headers: {
          "Content-Type": "application/json", // Fixed incorrect 'applications/json' to 'application/json'
          Authorization: `Bearer ${accessToken}`, // Added a space after 'Bearer' and used template literals for clarity
        },
      };
      try {
        const response = await fetch(url, authorizationSearch);
        if(response.ok) {
          const jsonResponse = await response.json();
          console.log(jsonResponse);
          setUserId(jsonResponse.id);
        }
      } catch(error) {
        console.log(error);
      }
    }
    const playlistMaker = async() => {
      const url = `https://api.spotify.com/v1/users/31hpdlxuvqqngh54ustxffmyd2fq/playlists/`;
      const authorizationSearch = {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Fixed incorrect 'applications/json' to 'application/json'
          Authorization: `Bearer ${accessToken}`, // Added a space after 'Bearer' and used template literals for clarity
        },
        body: JSON.stringify({
          name: title,
          description: "Playing with Api",
          public: false,
         
        }),
      };
      try{
        const res = await fetch(url, authorizationSearch);
        if(res.ok ) {
          const responseJson = await res.json();
          playlistId = responseJson.id;
        } 
      }catch(error) {
        console.log(error);
      }
    }

    const savingSong = async() => {
      const url =  ` https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
      const data = {
        uris: uris, // Must contain valid URIs
        position: 0
    };
      const authorizationSearch = {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Fixed incorrect 'applications/json' to 'application/json'
          Authorization: `Bearer ${accessToken}`, // Added a space after 'Bearer' and used template literals for clarity
        },
        body: JSON.stringify(data)
        
        };
        try {
          const resp = await fetch(url, authorizationSearch);
          if(resp.ok) {
            const respJson = await resp.json();
            console.log(respJson);
          }  else {
            console.log("something Went Worng")
          }
        }catch(error) {
          console.log(error);
        }
      };
    
      getUserId();
      if(title.length !== 0 && addSong.length !==0) {
        setLoading(true);
        setDisplay(true);
      }
  
    setTimeout(() => {
     
      
      playlistMaker();
    }, 1000);

    setTimeout(() => {
      savingSong();
      setDisplay(false);
     
    }, 3000);
    setTimeout(()=> {
      setLoading(false);
    }, 5000)

    setAddSong([]);
    setTitle('');
  }

  function addPlay(index) {
   setAddSong(prev => {
    if(prev.includes(playlist[index])) {
      return [...prev];
    } else {
      return [
        playlist[index], ...prev
       ];
     
    }
   })
   console.log(addSong);
  }

  function removePlay(i) {
    setAddSong(addSong.filter((item, index) => index !== i));
  }

  const track = addSong.map((song, index) => {
    return (
      <>
        <div className={styles.innerBoxTwo}>
          <div className={styles.bottomBorder}>
            <ul>
              <li><img src={song.image} alt="image"
               style={{
                width: 50,
                height:50,
                
              }}
              /></li>
              </ul>

              <ul>
              <li key={index}>{song.songName}</li>

              <li>{song.artistName}</li>
            </ul>
          </div>
          <div>
            <button
              onClick={() => removePlay(index)}
              className={styles.plusButton}
            >
              -
            </button>
          </div>
        </div>
      </>
    );
  });

 
  const refreshAccessToken = async () => {
    try {
      const url = "https://accounts.spotify.com/api/token";

      const payload = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: clientId,
        }),
      };
      const response = await fetch(url, payload);
      const data = await response.json();
      setAccessToken(data.access_token);
      setExpirationTime(Date.now() + data.expires_in * 1000);

      scheduleTokenRefresh(expirationTime - 60);
    } catch (error) {
      console.log(error);
    }
  };

  const scheduleTokenRefresh = (delayInSeconds) => {
    setTimeout(() => {
      refreshAccessToken();
    }, delayInSeconds * 1000);
  };
  return (
    <>
      <Header accessToken={accessToken} setAccessToken={setAccessToken} />
      <SearchBar
        input={input}
        setInput={setInput}
        accessToken={accessToken}
        playlist={playlist}
        setPlaylist={setPlaylist}
        setNewSong={setNewSong}
        filterSong={filterSong}
        setSingerName={setSingerName}
        singerName={singerName}
      />
     <PlaylistContainer
     addPlay={addPlay}
      newSong={newSong} 
      title={title}
      setTitle ={setTitle}
      track ={track}
      visble={visble}
      loading={loading}
      handleSubmit={handleSubmit}
      // savedPlaylist={savedPlaylist}
      singerName={singerName}
      playlist={playlist}
      display={display}
       />
    </>
  );
}

export default App;
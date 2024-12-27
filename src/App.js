import React, { useState, useEffect } from "react";
import styles from "./jamming.module.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import PlaylistContainer from "./components/PlaylistContainer";

export const clientId = "27e5a678ded9406f9eac4d869726a110";

function App() {
  // States
  const [playlistName, setPlaylistName] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [addSong, setAddSong] = useState([]);
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");
  const [song, setSong] = useState({ song: [] });
  const [toggle, setToggle] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [singerName, setSingerName] = useState("");

  const [visble, setVisble] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newSong, setNewSong] = useState([]);
  const [login, setLogin] = useState(false);

  const [info, setInfo] = useState(() => {
    const saved = localStorage.getItem("savedPlaylist");
    return saved
      ? JSON.parse(saved)
      : {
          heading: "",
          song: [],
        };
  });

  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("spotifyAccessToken") || ""
  );
  const [refreshToken, setRefreshToken] = useState("");

  const [expirationTime, setExpirationTime] = useState(0);

  // Hooks

  useEffect(() => {
    setVisble(true);
    setToggle(true);
    setShowPlaylist(true);
    setInput(localStorage.getItem("searchTerm"));

    console.log(info);
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
    setInfo((prev) => {
      return {
        ...prev,
        heading: title,
        song: addSong,
      };
    });

    setSong((prev) => {
      return {
        ...prev,
        song: addSong,
      };
    });

    if (title.length !== 0 && song.song.length !== 0) {
      setLoading(true);

      setPlaylistName(title);
      setToggle(true);

      setAddSong([]);
      setTitle("");
      setVisble(false);
      setPlaylist([]);
      localStorage.setItem("savedPlaylist", JSON.stringify(info));
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

  function addPlay(i) {
    setAddSong((prev) => {
      if (prev.includes(newSong[i])) {
        return [...prev];
      } else {
        return [newSong[i], ...prev];
      }
    });
  }

  function removePlay(i) {
    setAddSong(addSong.filter((item, index) => index !== i));
  }

  const track = addSong.map((song, index) => {
    return (
      <>
        <div className={styles.innerBoxTwo}>
          <div>
            <ul>
              <li key={index}>{song}</li>

              <li>{singerName}</li>
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

  const savedPlaylist = (
    <div className={styles.savedtrack}>
      <div className={styles.savedtrackcont}>
        <div>{toggle && <h3>{info.heading}</h3>}</div>

        <div>
          {toggle && !showPlaylist ? (
            <button
              onClick={() => setShowPlaylist(true)}
              className={styles.savedtrackButton}
            >
              +
            </button>
          ) : null}
          {toggle && showPlaylist && (
            <button
              onClick={() => setShowPlaylist(false)}
              className={styles.savedtrackButton}
            >
              -
            </button>
          )}
        </div>
      </div>

      <div className={styles.lastchild}>
        {showPlaylist && toggle && (
          <ul>
            {info.song.map((song, index) => (
              <li className={styles.liststyle} key={index}>
                {song}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

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
        info={info}
      />
      <>
        <div className={styles.box}>
          <div className={styles.firstbox}>
            <h2>Results</h2>
            {newSong.slice(0, 10).map((tracks, index) => {
              return (
                <>
                  <div className={styles.innerBoxOne}>
                    <div className={styles.bottomBorder}>
                      <ul>
                        <li>{tracks}</li>

                        <li>{singerName}</li>
                        <li></li>
                      </ul>
                    </div>

                    <div>
                      <button
                        onClick={() => addPlay(index)}
                        className={styles.plusButton}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <hr></hr>
                </>
              );
            })}
          </div>
          <div className={styles.secondbox}>
            <div>
              <input
                type="text"
                value={title}
                className={styles.input2}
                onChange={({ target }) => {
                  setTitle(target.value);
                }}
              />
            </div>
            <div>{track}</div>
            <div>
              <button
                type="submit"
                onClick={handleSubmit}
                className={styles.savePlaylistButton}
              >
                Save Playlist
              </button>
            </div>
          </div>
          {visble && (
            <div>
              {loading ? <p>Paylist Being Saved....</p> : savedPlaylist}
            </div>
          )}
        </div>
      </>
    </>
  );
}

export default App;
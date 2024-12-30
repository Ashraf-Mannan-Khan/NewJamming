import React, { useEffect } from "react";
import styles from './jammingNew.module.css'

const SearchBar = ({input, setInput, accessToken, playlist, setPlaylist, setNewSong, info, singerName, setSingerName,filterSong}) => {


  const onSearch = async (event) => {
    event.preventDefault();
    localStorage.setItem("searchTerm", input);
    const url = `https://api.spotify.com/v1/search?q=${input}&type=track&include_external=audio&limit=20`;

    const authorizationSearch = {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Fixed incorrect 'applications/json' to 'application/json'
        Authorization: `Bearer ${accessToken}`, // Added a space after 'Bearer' and used template literals for clarity
      },
    };

    try {
      const res = await fetch(url, authorizationSearch);

      console.log();

      if (!res.ok) {
        console.log({ res });
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json(); // Awaited the response JSON parsing
      

    console.log(data.tracks.items);
     for(let i=0; i <  data.tracks.items.length; i++) {
      setPlaylist(prev => [
        {songName: data.tracks.items[i].name,
          artistName: data.tracks.items[i].artists.map(artist => artist.name).join(' & '),
          id: data.tracks.items[i].id,
        uri: data.tracks.items[i].uri,
          image: data.tracks.items[i].album.images[0].url
      }, ...prev
        
      ]);
     }
     
  
      // console.log(playlist.filter(s => info.song.every(val => val !== s)));
    //  console.log(data.tracks.items[0].artists[0].name  ) ;
    } catch (error) {
      console.error("Error fetching song:", error);
    }
    
  
  };


  return (
    <div className={styles.searchContainer} value={input}>
      <input
        type="search"
        id="input"
        onChange={({ target }) => {
          setInput(target.value);
        }}
        value={input}
        className={styles.inputBar}
      />
      <button onClick={onSearch} className={styles.searchButton}>
        {" "}
        Search
      </button>
    </div>
  );
};

export default SearchBar;
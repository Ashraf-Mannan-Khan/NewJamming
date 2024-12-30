import React from 'react';
import styles from './jammingNew.module.css';
// styles, addPlay, newSong, title, setTitle, track, handleSubmit, visible, loading, savedPlaylist
const PlaylistContainer = ({ addPlay, newSong, title, setTitle, track, visble, loading, handleSubmit, savedPlaylist, singerName, playlist,display }) => {

  
  return (
    <>
      <div className={styles.box}>
        <div className={styles.firstbox}>
          <h2>Results</h2>
          {/* {playlist.map((song, index)=> {
            return (
              <>
              <div>{song.name}</div>
              <div>{song.artists.map(artist => artist.name ).join('&')}</div>
              </>
              
            )
           })} */}
          {playlist.slice(0, 10).map((tracks, index) => {
            return (
              <>
                <div className={styles.innerBoxOne}>
                  <div className={styles.bottomBorder}>
                    <ul>
                      <li><img src={tracks.image} alt="image" style={{
                        width: 50,
                        height: 50
                      }} /></li>
                      <li>{tracks.songName}</li>
                      <li>{tracks.artistName}</li>

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

              </>
            );
          })}
        </div>
        {loading && <div className={styles.card}>
           {display ?  <div className={styles.cardChildOne}>
            <p >Paylist being Saved</p>
            <div className={styles.spinner}></div>
          </div> : <div className={styles.cardChildTwo}>
              <p> Playlist has been saved</p>
            <div className={styles.checkmarkWrapper}>
                <div className={styles.checkmark}></div>
              </div>
            </div>}
        </div>}
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
       

      </div>
    </>
  );
};

export default PlaylistContainer;

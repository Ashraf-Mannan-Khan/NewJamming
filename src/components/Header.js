import React from "react";
import styles from "../jamming.module.css";
import {clientId} from '../App';

const redirectUri = "http://localhost:3000/callback";
const scopes = "user-read-private user-read-email user-library-read";

const Header = ({accessToken, setAccessToken}) => {
  const handleLogin = () => {
    const loginUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(
      encodeURIComponent(scopes)
    )}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = loginUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem("spotifyAccessToken");
    setAccessToken("");
  };
  return (
    <div className={styles.heading}>
      <h1>Jamming</h1>
      {!accessToken ? (
        <button onClick={handleLogin}>Login to spotify</button>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </div>
  );
};


export default Header;

  
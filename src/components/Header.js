import React from "react";
import styles from "./jammingNew.module.css";
import {clientId} from '../App';
import logo from './image/headphones.png'
const redirectUri = "http://localhost:3000/callback";
const scopes = " playlist-modify-private playlist-modify-public user-read-private user-read-email user-library-read ";


const Header = ({accessToken, setAccessToken}) => {
  const handleLogin = () => {
    const loginUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${
      encodeURIComponent(scopes)
    }&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = loginUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem("spotifyAccessToken");
    setAccessToken("");
    localStorage.clear();
  };
  return (
    <div className={styles.heading}>
      <img src={logo} alt="abcd"/>
      <h1>Jamming</h1>
      {!accessToken ? (
        <button onClick={handleLogin} className={styles.logInOut}>Login to spotify</button>
      ) : (
        <button onClick={handleLogout} className={styles.logInOut}>Logout</button>
      )}
    </div>
  );
};


export default Header;

  
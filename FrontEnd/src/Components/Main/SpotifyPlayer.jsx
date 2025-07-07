import React, { useEffect, useState } from 'react';

function SpotifyPlayer() {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const spotifyToken = localStorage.getItem('spotifyToken');

  // Fetch user profile
  useEffect(() => {
    if (spotifyToken) {
      fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${spotifyToken}`
        }
      })
        .then(res => res.json())
        .then(data => setProfile(data));
    }
  }, [spotifyToken]);

  // Fetch user playlists
  useEffect(() => {
    if (spotifyToken) {
      fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          'Authorization': `Bearer ${spotifyToken}`
        }
      })
        .then(res => res.json())
        .then(data => setPlaylists(data.items || []));
    }
  }, [spotifyToken]);

  // Fetch tracks for selected playlist
  useEffect(() => {
    if (spotifyToken && selectedPlaylist) {
      fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`, {
        headers: {
          'Authorization': `Bearer ${spotifyToken}`
        }
      })
        .then(res => res.json())
        .then(data => setTracks(data.items || []));
    }
  }, [spotifyToken, selectedPlaylist]);

  return (
    <div>
      <h2>Spotify Profile</h2>
      {profile ? (
        <div>
          <p>Name: {profile.display_name}</p>
          <p>Email: {profile.email}</p>
        </div>
      ) : (
        <div>Loading profile...</div>
      )}

      <h3>Your Playlists</h3>
      <select
        onChange={e => setSelectedPlaylist(e.target.value)}
        value={selectedPlaylist}
      >
        <option value="">Select a playlist</option>
        {playlists.map(playlist => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.name}
          </option>
        ))}
      </select>

      <h3>Tracks</h3>
      <ul>
        {tracks.map(item => (
          <li key={item.track.id}>
            {item.track.name} - {item.track.artists.map(a => a.name).join(', ')}
            {' '}
            <a
              href={item.track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              ▶️ Play on Spotify
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SpotifyPlayer;
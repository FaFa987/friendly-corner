import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


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
      <h3>Your profile</h3>
      {profile && profile.display_name && profile.email ? (
  <Card sx={{ maxWidth: 345, mb: 2 }}>
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {profile.display_name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Email: {profile.email}
      </Typography>
    </CardContent>
  </Card>
) : (
  <Card sx={{ maxWidth: 345, mb: 2 }}>
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        Loading profile...
      </Typography>
    </CardContent>
  </Card>
)}

      <h3>Your Playlists</h3>

      <Box sx={{ minWidth: 240 }}>
        <FormControl fullWidth>
          <InputLabel id="playlist-select-label">Select a playlist</InputLabel>
          <Select
            labelId="playlist-select-label"
            id="playlist-select"
            value={selectedPlaylist}
            label="Select a playlist"
            onChange={e => setSelectedPlaylist(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {playlists.map(playlist => (
              <MenuItem key={playlist.id} value={playlist.id}>
                {playlist.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

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
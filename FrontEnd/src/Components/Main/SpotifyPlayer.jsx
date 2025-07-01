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
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', mb: 4, boxShadow: 6, bgcolor: 'rgba(255,255,255,0.95)' }}>
        <CardContent>
          <Typography variant="h3" align="center" sx={{ fontWeight: 700, color: '#185a9d', mb: 2 }}>
            🎵 My Spotify
          </Typography>
          {profile && profile.display_name && profile.email ? (
            <>
              <Typography variant="h5" align="center" sx={{ color: '#43cea2', fontWeight: 600 }}>
                {profile.display_name}
              </Typography>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                Email: {profile.email}
              </Typography>
            </>
          ) : (
            <Typography align="center" color="text.secondary">
              Loading profile...
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card sx={{ maxWidth: 400, width: '100%', mb: 4, boxShadow: 4, bgcolor: 'rgba(255,255,255,0.9)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#185a9d', fontWeight: 600 }}>
            Your Playlists
          </Typography>
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
        </CardContent>
      </Card>

      {selectedPlaylist && (
        <Card sx={{ maxWidth: 600, width: '100%', boxShadow: 3, bgcolor: 'rgba(255,255,255,0.95)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#43cea2', fontWeight: 600 }}>
              Tracks
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {tracks.length === 0 && (
                <Typography color="text.secondary">No tracks found.</Typography>
              )}
              {tracks.map(item => (
                <li key={item.track.id} style={{ marginBottom: 8 }}>
                  <Typography component="span" sx={{ fontWeight: 500 }}>
                    {item.track.name}
                  </Typography>
                  {' – '}
                  <Typography component="span" sx={{ color: '#185a9d' }}>
                    {item.track.artists.map(a => a.name).join(', ')}
                  </Typography>
                  {' '}
                  <a
                    href={item.track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', marginLeft: 8 }}
                  >
                    <span role="img" aria-label="play">▶️</span> Play
                  </a>
                </li>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default SpotifyPlayer;
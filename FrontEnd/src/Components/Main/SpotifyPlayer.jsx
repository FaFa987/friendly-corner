import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function SpotifyPlayer() {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem('spotifyToken'));

  // --- 1. Check for token in URL and store it ---
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (token) {
    localStorage.setItem('spotifyToken', token);
    setSpotifyToken(token);
    window.history.replaceState({}, document.title, window.location.pathname);
    // Force reload to re-mount the component
  }
}, []);

useEffect(() => {
  if (spotifyToken) {
    console.log('Using token:', spotifyToken);
    fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${spotifyToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert('Spotify API error: ' + data.error.message);
        }
        setProfile(data);
      });
  } else {
    setProfile(null);
  }
}, [spotifyToken]);

  // --- 3. Fetch user playlists ---
  useEffect(() => {
    if (spotifyToken) {
      fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          'Authorization': `Bearer ${spotifyToken}`
        }
      })
        .then(res => res.json())
        .then(data => setPlaylists(data.items || []));
    } else {
      setPlaylists([]);
    }
  }, [spotifyToken]);

  // --- 4. Fetch tracks for selected playlist ---
  useEffect(() => {
    if (spotifyToken && selectedPlaylist) {
      fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`, {
        headers: {
          'Authorization': `Bearer ${spotifyToken}`
        }
      })
        .then(res => res.json())
        .then(data => setTracks(data.items || []));
    } else {
      setTracks([]);
    }
  }, [spotifyToken, selectedPlaylist]);

  // --- 5. Logout handler ---
  const handleLogout = () => {
    localStorage.removeItem('spotifyToken');
    setSpotifyToken(null);
    setProfile(null);
    setPlaylists([]);
    setTracks([]);
    setSelectedPlaylist('');
  };

  // --- 6. Login handler ---
  const handleLogin = () => {
    window.location.href = 'https://localhost:5000/api/spotifyauth/login';
  };

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
      <Card
        sx={{
          maxWidth: 440,
          width: '100%',
          mb: 4,
          boxShadow: 10,
          bgcolor: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(8px)',
          borderRadius: 5,
          px: 2,
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <span style={{ fontSize: 64, color: '#185a9d', marginBottom: 8 }}>🎵</span>
            <Typography variant="h3" align="center" sx={{ fontWeight: 700, color: '#185a9d', mb: 1 }}>
              My Spotify
            </Typography>
          </Box>
          {!spotifyToken ? (
            <Button
              id="connect-spotify"
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '1.1rem',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                boxShadow: 3,
                mb: 2
              }}
              onClick={handleLogin}
            >
              <span role="img" aria-label="spotify" style={{ marginRight: 8 }}>🎵</span>
              Connect Spotify
            </Button>
          ) : (
            <>
              <Typography variant="h5" align="center" sx={{ color: '#43cea2', fontWeight: 600 }}>
                {profile?.display_name}
              </Typography>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                Email: {profile?.email}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{ mt: 1 }}
              >
                Logout
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Playlist Card */}
      {spotifyToken && (
        <Card
          sx={{
            maxWidth: 440,
            width: '100%',
            mb: 4,
            boxShadow: 8,
            bgcolor: 'rgba(255,255,255,0.8)',
            borderRadius: 5,
            px: 2,
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#185a9d', fontWeight: 700 }}>
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
                  sx={{
                    bgcolor: '#f5fafd',
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
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
      )}

      {/* Tracks Card */}
      {spotifyToken && selectedPlaylist && (
        <Card sx={{ maxWidth: 900, width: '100%', boxShadow: 4, bgcolor: 'rgba(255,255,255,0.97)', mt: 2 }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 3, color: '#185a9d', fontWeight: 700 }}>
              Playlist Tracks
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
              {tracks.length === 0 && (
                <Typography color="text.secondary">No tracks found.</Typography>
              )}
              {tracks.map(item => (
                <Card
                  key={item.track.id}
                  sx={{
                    width: 260,
                    minHeight: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: '#e3f2fd',
                    boxShadow: 3,
                    borderRadius: 3,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.04)' },
                  }}
                >
                  {item.track.album?.images?.[0]?.url && (
                    <Box
                      component="img"
                      src={item.track.album.images[0].url}
                      alt={item.track.name}
                      sx={{
                        width: 180,
                        height: 180,
                        borderRadius: 2,
                        mb: 2,
                        boxShadow: 2,
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#185a9d', textAlign: 'center' }}>
                    {item.track.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#43cea2', mb: 1, textAlign: 'center' }}>
                    {item.track.artists.map(a => a.name).join(', ')}
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    href={item.track.preview_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 1, background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)' }}
                    disabled={!item.track.preview_url}
                    startIcon={<span role="img" aria-label="demo">🎧</span>}
                  >
                    {item.track.preview_url ? 'Show Demo' : 'No Demo'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    href={item.track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 1, ml: 0 }}
                    startIcon={<span role="img" aria-label="spotify">🟢</span>}
                  >
                    Open in Spotify
                  </Button>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default SpotifyPlayer;
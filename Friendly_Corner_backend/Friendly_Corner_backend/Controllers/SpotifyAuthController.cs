using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Friendly_Corner_backend.Models;

namespace Friendly_Corner_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpotifyAuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public SpotifyAuthController(IConfiguration config)
        {
            _config = config;
            _httpClient = new HttpClient();
        }

        // Step 1: Redirect user to Spotify login
        [HttpGet("login")]
        public IActionResult Login()
        {
            var clientId = _config["Spotify:ClientId"];
    var redirectUri = _config["Spotify:RedirectUri"];
    var scope = "user-read-private user-read-email playlist-read-private playlist-read-collaborative";

    if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(redirectUri))
    {
        return BadRequest("Spotify ClientId or RedirectUri is not configured.");
    }

    var url = $"https://accounts.spotify.com/authorize?client_id={clientId}&response_type=code&redirect_uri={Uri.EscapeDataString(redirectUri)}&scope={Uri.EscapeDataString(scope)}";
    return Redirect(url);
        }

        // Step 2: Spotify redirects here with code, exchange for token
        [HttpGet("callback")]
        public async Task<IActionResult> Callback([FromQuery] string code)
        {
            var clientId = _config["Spotify:ClientId"];
            var clientSecret = _config["Spotify:ClientSecret"];
            var redirectUri = _config["Spotify:RedirectUri"];

            if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(redirectUri))
            {
                return BadRequest("Code or RedirectUri is missing.");
            }
            
            var authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));

            var request = new HttpRequestMessage(HttpMethod.Post, "https://accounts.spotify.com/api/token");
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", authHeader);
            request.Content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                new KeyValuePair<string, string>("code", code),
                new KeyValuePair<string, string>("redirect_uri", redirectUri)
            });

            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return BadRequest(content);

            // Return the token to the frontend
            return Content(content, "application/json");
        }

        // Step 3: Refresh access token using refresh token
[HttpPost("refresh")]
public async Task<IActionResult> Refresh([FromBody] RefreshRequest body)
{
    var refreshToken = body.refreshToken;

    var clientId = _config["Spotify:ClientId"];
    var clientSecret = _config["Spotify:ClientSecret"];

    var authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));

    var request = new HttpRequestMessage(HttpMethod.Post, "https://accounts.spotify.com/api/token");
    request.Headers.Authorization = new AuthenticationHeaderValue("Basic", authHeader);
    request.Content = new FormUrlEncodedContent(new[]
    {
        new KeyValuePair<string, string>("grant_type", "refresh_token"),
        new KeyValuePair<string, string>("refresh_token", refreshToken)
    });

    var response = await _httpClient.SendAsync(request);
    var content = await response.Content.ReadAsStringAsync();

    if (!response.IsSuccessStatusCode)
        return BadRequest(content);

    return Content(content, "application/json");
}
    }
}
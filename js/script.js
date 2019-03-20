var obj;
var id;
var audiofeature;
var dance;

// Get the hash of the url
const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = '027618dc955741e3925623fcee718fad';

const redirectUri = 'https://vidianindhita.github.io/mood-music-player/';
const scopes = [
  'streaming',
  'user-read-birthdate',
  'user-read-private',
  'user-modify-playback-state'
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

// Set up the Web Playback SDK
window.onSpotifyPlayerAPIReady = () => {
  const player = new Spotify.Player({
    name: 'Mood Music Player',
    getOAuthToken: cb => { cb(_token); }
  });

  // Error handling
  player.on('initialization_error', e => console.error(e));
  player.on('authentication_error', e => console.error(e));
  player.on('account_error', e => console.error(e));
  player.on('playback_error', e => console.error(e));

  // Playback status updates
  player.on('player_state_changed', state => {
    obj = state;
    id = obj.track_window.current_track.id;
    audiofeature = getAudioTrack(id);
    console.log(id);
    $('#current-track').attr('src', state.track_window.current_track.album.images[0].url);
    $('#current-track-name').text(state.track_window.current_track.name);
  });

  // Ready
  player.on('ready', data => {
    console.log('Ready with Device ID', data.device_id);
    
    // Play a track using our new device ID
    play(data.device_id);
  });

  // Connect to the player
  player.connect();
}

// Play a specified track on the Web Playback SDK's device ID
function play(device_id) {
  $.ajax({
   url: "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
   type: "PUT",
   data: '{"uris": ["spotify:track:4aT6vP9y2eDjxmRGm5ZqSC"]}',
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
   success: function(data) { 
     console.log(data)
   }
  });
}

function getAudioTrack(id) {
  console.log("Audio Track");
  $.ajax({
   url: "https://api.spotify.com/v1/audio-features/" + id,
   type: "GET",
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
   success: function(data) {

    dance = data.danceability;

     if (dance > 0.7) {
        console.log(dance);
        $('#audio-features').text("Happy Song");

        // HOME IP
        // $.get("http://192.168.1.47/H", function(data, status){
        //   alert("Data: " + data + "\nStatus: " + status);
        // });

        // VIDIAS PHONE
        $.get("http://172.20.10.10/H", function(data, status){
          alert("Data: " + data + "\nStatus: " + status);
        });
     } else {
        $('#audio-features').text("Mellow Song");
     }
     
   }
  });
}

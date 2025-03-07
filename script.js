let now_playing = document.querySelector('.now-playing');
let track_art = document.querySelector('.track-art');
let track_name = document.querySelector('.track-name');
let track_artist = document.querySelector('.track-artist');

let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev_track');

let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let wave = document.getElementById('wave');
let randomIcon = document.querySelector('.fa-random');

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

let curr_track = new Audio();

const music_list = [
    { img: '7rings.jpeg', name: '7 rings', artist: 'Ariana Grande', music: '7rings.mp3' },
    { img: 'espresso.jpg', name: 'Espresso', artist: 'Sabrina Carpenter', music: 'espresso.mp3' },
    { img: 'starboy.jpg', name: 'Starboy', artist: 'Weeknd', music: 'starboy.mp3' },
    { img: 'wildest.jpg', name: 'Wildest Dreams', artist: 'Taylor Swift', music: 'wildestdreams.mp3' }
];

loadTrack(track_index);

// Load a track
function loadTrack(track_index) {
    clearInterval(updateTimer);
    reset();

    curr_track.src = music_list[track_index].music;
    curr_track.load();

    track_art.style.backgroundImage = `url('${music_list[track_index].img}')`;
    track_name.textContent = music_list[track_index].name;
    track_artist.textContent = music_list[track_index].artist;
    now_playing.textContent = `Playing music ${track_index + 1} of ${music_list.length}`;

    updateTimer = setInterval(setUpdate, 1000);
    curr_track.addEventListener('ended', nextTrack);
    random_bg_color();
}

// Generate random background gradient
function random_bg_color() {
    let hex = '0123456789abcdef';
    let populate = () => '#' + Array.from({ length: 6 }, () => hex[Math.floor(Math.random() * 16)]).join('');
    document.body.style.background = `linear-gradient(to right, ${populate()}, ${populate()})`;
}

// Reset track info
function reset() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

// Toggle random track selection
function randomTrack() {
    isRandom = !isRandom;
    randomIcon.classList.toggle('randomActive', isRandom);
}

// Repeat the current track
function repeatTrack() {
    loadTrack(track_index);
    playTrack();
}

// Play or pause the track
function playpauseTrack() {
    isPlaying ? pauseTrack() : playTrack();
}

// Play the track
function playTrack() {
    curr_track.play();
    isPlaying = true;
    track_art.classList.add('rotate');
    wave.classList.add('loading-wave');
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

// Pause the track
function pauseTrack() {
    curr_track.pause();
    isPlaying = false;
    track_art.classList.remove('rotate');
    wave.classList.remove('loading-wave');
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

// Play next track
function nextTrack() {
    track_index = isRandom ? Math.floor(Math.random() * music_list.length) : (track_index + 1) % music_list.length;
    loadTrack(track_index);
    playTrack();
}

// Play previous track
function prevTrack() {
    track_index = (track_index - 1 + music_list.length) % music_list.length;
    loadTrack(track_index);
    playTrack();
}

// Seek track position
seek_slider.addEventListener("input", () => {
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
});

// Adjust volume
volume_slider.addEventListener("input", () => {
    curr_track.volume = volume_slider.value / 100;
});

// Update seek slider and time display
function setUpdate() {
    if (!isNaN(curr_track.duration)) {
        let seekPosition = (curr_track.currentTime / curr_track.duration) * 100;
        seek_slider.value = seekPosition;

        let formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
        let currentMinutes = formatTime(curr_track.currentTime / 60);
        let currentSeconds = formatTime(curr_track.currentTime % 60);
        let durationMinutes = formatTime(curr_track.duration / 60);
        let durationSeconds = formatTime(curr_track.duration % 60);

        curr_time.textContent = `${currentMinutes}:${currentSeconds}`;
        total_duration.textContent = `${durationMinutes}:${durationSeconds}`;
    }
}

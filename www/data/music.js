// ===== GAME MUSIC (ek hi jagah se sab games ka music control) =====
// Har game ke liye apna music: file ko assets/music/ me daalo aur neeche us game ke saamne naam likho.
// File na mile to us game me music nahi bajega (koi error nahi aata).
// Tips: mp3, 96kbps, 1 se 1.5 MB tak, loop hone layak track rakho.
window.GAME_MUSIC = {
  enabled: true,          // false karoge to sabhi games ka music band
  volume: 0.5,            // sabhi games ka default music volume (0 se 1)
  sfxVolume: 1,           // sound effects ka default volume (0 se 1)
  button: "right",        // in-game music button: "right" | "left" | "top-right" | "top-left" | "off"
  // game folder ka naam => { src: music file, vol: us game ke liye volume multiplier (0 se 1), off: true = us game me music band }
  games: {
    game1:  { src: "assets/music/game1.mp3",  vol: 1 },
    game2:  { src: "assets/music/game2.mp3",  vol: 1 },
    game3:  { src: "assets/music/game3.mp3",  vol: 1 },
    game4:  { src: "assets/music/game4.mp3",  vol: 1 },
    game5:  { src: "assets/music/game5.mp3",  vol: 1 },
    game6:  { src: "assets/music/game6.mp3",  vol: 1 },
    game7:  { src: "assets/music/game7.mp3",  vol: 1 },
    game8:  { src: "assets/music/game8.mp3",  vol: 1 },
    game9:  { src: "assets/music/game9.mp3",  vol: 1 },
    game10: { src: "assets/music/game10.mp3", vol: 1 },
    game11: { src: "assets/music/game11.mp3", vol: 1 },
    game12: { src: "assets/music/game12.mp3", vol: 1 },
    game13: { src: "assets/music/game13.mp3", vol: 1 },
    game14: { src: "assets/music/game14.mp3", vol: 1 },
    game15: { src: "assets/music/game15.mp3", vol: 1 },
    game16: { src: "assets/music/game16.mp3", vol: 1 },
    game17: { src: "assets/music/game17.mp3", vol: 1 },
    game18: { src: "assets/music/game18.mp3", vol: 1 },
    game19: { src: "assets/music/game19.mp3", vol: 1 },
    game20: { src: "assets/music/game20.mp3", vol: 1 },
    game21: { src: "assets/music/game21.mp3", vol: 1 },
    game22: { src: "assets/music/game22.mp3", vol: 1 },
    game23: { src: "assets/music/game23.mp3", vol: 1 }
  }
};

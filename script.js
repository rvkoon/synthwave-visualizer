const playBtn = document.getElementById("playButton");
const audioBox = document.getElementById("audioBox");
const gridContainer = document.getElementById("gridContainer");
let animationFrame = null;
let isPlaying = false;
let winH = 0;
let needRequestFrame = false;
let bars = null;
const frequencies = [200, 300, 400, 500, 600, 700, 800, 1000, 1500, 2000];

// INIT

function createGridItem() {
  const newDiv = document.createElement("div");
  newDiv.className = "gridItem";
  gridContainer.appendChild(newDiv);
}

function createBar(idx) {
  const newDiv = document.createElement("div");
  newDiv.className = "bar";
  newDiv.style.left = idx * 10 + "%";
  newDiv.style.height = Math.floor(Math.random() * idx * 10) + "%";
  gridContainer.appendChild(newDiv);
}

function initPage() {
  winH = window.innerHeight * 0.6;
  for (let i = 0; i < 100; i++) {
    createGridItem();
  }
  for (let i = 0; i < 10; i++) {
    createBar(i);
  }

  bars = document.querySelectorAll(".bar");
  playBtn.style.display = "block";
}

window.onload = initPage();

// AUDIO

let audioCtx = new AudioContext();
let analyser = audioCtx.createAnalyser();
analyser.fftSize = 32;
let source = audioCtx.createMediaElementSource(audioBox);
source.connect(analyser);
source.connect(audioCtx.destination);
let data = new Uint8Array(analyser.frequencyBinCount);

function loopWhileMusicIsPlaying() {
  audioCtx.resume();
  animationFrame = requestAnimationFrame(loopWhileMusicIsPlaying);
  analyser.getByteFrequencyData(data);
  bars.forEach(function (bar, idx) {
    bar.style.height = data[Math.ceil((data.length / 12) * idx + 1)] + "px";
  });
}

// EVENTS

playBtn.addEventListener("click", function () {
  if (isPlaying) {
    audioBox.pause();
    playBtn.innerText = "PLAY";
    cancelAnimationFrame(animationFrame);
    return (isPlaying = false);
  }
  audioBox.play();
  playBtn.innerText = "PAUSE";
  isPlaying = true;
  animationFrame = requestAnimationFrame(loopWhileMusicIsPlaying);
});

audioBox.onended = function () {
  playBtn.innerText = "PLAY";
};

const playBtn = document.getElementById("playButton");
const audioBox = document.getElementById("audioBox");
const gridContainer = document.getElementById("gridContainer");
let animationFrame = null;
let isPlaying = false;
let winH = 0;
let needRequestFrame = false;
let bars = null;

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
analyser.fftSize = 128;
let source = audioCtx.createMediaElementSource(audioBox);
source.connect(analyser);
source.connect(audioCtx.destination);
let data = new Uint8Array(analyser.frequencyBinCount);

function loopWhileMusicIsPlaying() {
  analyser.getByteFrequencyData(data);
  bars.forEach(function (bar, idx) {
    const percentage = (data[idx + 6] * 100) / 255;
    bar.style.height = (winH * (percentage / 100)) / 2 + "px";
  });
  setTimeout(function () {
    animationFrame = requestAnimationFrame(loopWhileMusicIsPlaying);
  }, 10);
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

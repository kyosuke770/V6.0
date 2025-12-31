let cards = [];
let index = 0;
let revealed = false;

const jpEl = document.getElementById("jp");
const enEl = document.getElementById("en");
const cardEl = document.getElementById("card");
const nextBtn = document.getElementById("next");

const audioEl = document.getElementById("audio");
const playBtn = document.getElementById("playAudio");

const AUDIO_SRC = "./audio/video01.mp3";
let stopTimer = null;

// CSV loader
fetch("./data.csv", { cache: "no-store" })
  .then(res => res.text())
  .then(text => {
    cards = parseCSV(text);
    render();
  });

function parseCSV(text) {
  const lines = text.trim().split("\n");
  lines.shift(); // header
  return lines.map(line => {
    const c = line.split(",");
    return {
      no: Number(c[0]),
      en: c[1],
      start: Number(c[2]),
      end: Number(c[3]),
      lv: Number(c[4])
    };
  });
}

function render() {
  const card = cards[index];
  jpEl.textContent = `No.${card.no}`;
  enEl.textContent = revealed ? card.en : "Tap to reveal";
}

function playAudio(card) {
  if (card.lv !== 1) return;
  if (!card.start || !card.end) return;

  if (audioEl.src !== location.origin + "/audio/video01.mp3") {
    audioEl.src = AUDIO_SRC;
  }

  if (stopTimer) clearTimeout(stopTimer);

  audioEl.currentTime = card.start;
  audioEl.play();

  stopTimer = setTimeout(() => {
    audioEl.pause();
  }, (card.end - card.start) * 1000);
}

// events
cardEl.addEventListener("click", () => {
  revealed = !revealed;
  render();
});

nextBtn.addEventListener("click", () => {
  revealed = false;
  index = (index + 1) % cards.length;
  render();
});

playBtn.addEventListener("click", () => {
  playAudio(cards[index]);
});

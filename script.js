const MAPILLARY_TOKEN = "MLY|25934228976162079|d732932e47e3b2ca8b3469273882fa8f";

let round = 1;
let totalScore = 0;

let actualLocation;
let guessMarker;

const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

function randomLocation() {
  return [
    Math.random() * 180 - 90,
    Math.random() * 360 - 180
  ];
}

async function loadStreetView() {
  actualLocation = randomLocation();

  const url = `https://graph.mapillary.com/images?access_token=${MAPILLARY_TOKEN}&fields=id&closeto=${actualLocation[1]},${actualLocation[0]}&limit=1`;

  const res = await fetch(url);
  const data = await res.json();

  const imageId = data.data[0].id;

  document.getElementById("streetView").innerHTML = `
    <img src="https://images.mapillary.com/${imageId}/thumb-2048.jpg" style="width:100%;height:100%;object-fit:cover">
  `;
}

map.on('click', e => {
  if (guessMarker) map.removeLayer(guessMarker);
  guessMarker = L.marker(e.latlng).addTo(map);
});

function calculateDistance(a, b) {
  const R = 6371;
  const dLat = (b[0] - a[0]) * Math.PI / 180;
  const dLon = (b[1] - a[1]) * Math.PI / 180;

  const x = Math.sin(dLat/2) ** 2 +
    Math.cos(a[0] * Math.PI / 180) *
    Math.cos(b[0] * Math.PI / 180) *
    Math.sin(dLon/2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
}

document.getElementById("guessBtn").onclick = () => {
  if (!guessMarker) return alert("Haritadan bir yer seç!");

  const guess = guessMarker.getLatLng();
  const distance = calculateDistance(actualLocation, [guess.lat, guess.lng]);

  const score = Math.max(0, Math.round(5000 * (1 - distance / 20000)));
  totalScore += score;

  document.getElementById("score").innerText = totalScore;

  round++;
  document.getElementById("round").innerText = round;

  if (round <= 5) {
    loadStreetView();
  } else {
    alert("Oyun bitti! Skor: " + totalScore);
  }
};

loadStreetView();

let round = 1;
let totalScore = 0;

let actualLocation;
let guessLocation;
let map, marker, panorama;

function randomLocation() {
  return {
    lat: Math.random() * 180 - 90,
    lng: Math.random() * 360 - 180
  };
}

function startRound() {
  document.getElementById("round").innerText = round;

  actualLocation = randomLocation();

  panorama = new google.maps.StreetViewPanorama(
    document.getElementById("streetView"),
    { position: actualLocation, pov: { heading: 0, pitch: 0 }, zoom: 1 }
  );

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 20, lng: 0 },
    zoom: 2,
    disableDefaultUI: true
  });

  map.addListener("click", (e) => {
    guessLocation = e.latLng;
    if (marker) marker.setMap(null);
    marker = new google.maps.Marker({ position: guessLocation, map });
  });
}

function calculateScore(distance) {
  const maxDistance = 20000000;
  let score = Math.max(0, Math.round(5000 * (1 - distance / maxDistance)));
  return score;
}

document.getElementById("guessBtn").onclick = () => {
  if (!guessLocation) return alert("Haritadan bir yer seç!");

  const distance = google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(actualLocation),
    guessLocation
  );

  const score = calculateScore(distance);
  totalScore += score;

  document.getElementById("score").innerText = totalScore;

  round++;

  if (round <= 5) {
    setTimeout(startRound, 1000);
  } else {
    alert("Oyun bitti! Skorun: " + totalScore);
  }
};

window.onload = startRound;

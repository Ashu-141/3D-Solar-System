const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("solarCanvas"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

const textureLoader = new THREE.TextureLoader();

const sun = createPlanet(10, "textures/sun.jpg");
scene.add(sun);

const planetsData = [
  { name: "Mercury", size: 1.0, distance: 7, speed: 0.01, texture: "textures/mercury.jpg" },
  { name: "Venus", size: 3.5, distance: 10, speed: 0.010, texture: "textures/venus.jpg" },
  { name: "Earth", size: 4.0, distance: 13, speed: 0.012, texture: "textures/earth.jpg" },
  { name: "Mars", size: 2.5, distance: 16, speed: 0.01, texture: "textures/mars.jpg" },
  { name: "Jupiter", size: 4.5, distance: 20, speed: 0.006, texture: "textures/jupiter.jpg" },
  { name: "Saturn", size: 4.0, distance: 25, speed: 0.004, texture: "textures/saturn.jpg" },
  { name: "Uranus", size: 3.5, distance: 30, speed: 0.003, texture: "textures/uranus.jpg" },
  { name: "Neptune", size: 3.5, distance: 35, speed: 0.00, texture: "textures/neptune.jpg" },
];



const planets = [];
const speedMap = {};
let angles = {};
let paused = false;

// Create planet meshes + speed sliders
planetsData.forEach((planet) => {
  const mesh = createPlanet(planet.size, planet.texture);
  mesh.position.x = planet.distance;
  scene.add(mesh);
  planets.push({ ...planet, mesh });
  speedMap[planet.name] = planet.speed;
  angles[planet.name] = Math.random() * Math.PI * 2;

  // Create speed sliders
  const div = document.createElement("div");
  div.innerHTML = `
    <label>${planet.name}</label>
    <input type="range" min="0.001" max="0.05" step="0.001" value="${planet.speed}" id="${planet.name}">
  `;
  document.getElementById("sliders").appendChild(div);

  document.getElementById(planet.name).addEventListener("input", (e) => {
    speedMap[planet.name] = parseFloat(e.target.value);
  });
});

function createPlanet(radius, texturePath) {
 // const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const geometry = new THREE.SphereGeometry(radius, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texturePath),
  });
  return new THREE.Mesh(geometry, material);
}

const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(0, 0, 0);
scene.add(light);

camera.position.z = 100;

function animate() {
  requestAnimationFrame(animate);

  if (!paused) {
    sun.rotation.y += 0.004;

    planets.forEach((planet) => {
      angles[planet.name] += speedMap[planet.name];
      planet.mesh.position.x = Math.cos(angles[planet.name]) * planet.distance;
      planet.mesh.position.z = Math.sin(angles[planet.name]) * planet.distance;
      planet.mesh.rotation.y += 0.01;
    });
  }

  renderer.render(scene, camera);
}

animate();

// Pause and Resume buttons
document.getElementById("pauseBtn").onclick = () => (paused = true);
document.getElementById("resumeBtn").onclick = () => (paused = false);

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

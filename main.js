import "./style.css";
import * as THREE from "three";

//Setup

const textureLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

//adds torus

const geometry = new THREE.TorusGeometry(12, 1, 5, 12);
const material = new THREE.MeshStandardMaterial({ color: 0x3531a8 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

//adds lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(ambientLight, pointLight);

//randomly generates stars

function addStar() {
  const geometry = new THREE.TetrahedronGeometry(0.25);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

//space
const spaceTexture = textureLoader.load("images/space.jpg");
scene.background = spaceTexture;

//avatar
const nicolasTexture = textureLoader.load("images/nicolas.jpg");

const nicolas = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: nicolasTexture })
);

scene.add(nicolas);

//moon
const moonTexture = textureLoader.load("images/moon texture.jpg");
const moonDisplacement = textureLoader.load("images/moon displacement.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshPhongMaterial({
    map: moonTexture,
    bumpMap: moonDisplacement,
    bumpScale: 0.3,
  })
);

scene.add(moon);
moon.position.z = 35;
moon.position.setX(-18);
moon.position.setY(3);

//earth

const earthTexture = textureLoader.load("images/earth.jpg");
const earthHeightMap = textureLoader.load("images/earthHeight.jpg");

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(4, 400, 400),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    bumpMap: earthHeightMap,
    bumpScale: 0.3,
  })
);

scene.add(earth);
earth.position.z = 30;
earth.position.setX(-15);

//saturn

const saturnTexture = textureLoader.load("images/2k_saturn.jpg");
const saturnRingTexture = textureLoader.load("images/saturn_rings.png");

const saturnPlanet = new THREE.Mesh(
  new THREE.SphereGeometry(8, 400, 400),
  new THREE.MeshStandardMaterial({
    map: saturnTexture,
  })
);

const saturnRings = new THREE.Mesh(
  new THREE.RingGeometry(10.5, 14, 400, 400, 0),
  new THREE.MeshStandardMaterial({
    map: saturnRingTexture,
    side: THREE.DoubleSide,
  })
);

scene.add(saturnPlanet, saturnRings);

saturnPlanet.position.z = 60;
saturnPlanet.position.setX(6);

const jupiterTexture = textureLoader.load("images/Jupiter_Map.jpg");
const jupiterBump = textureLoader.load("images/Jupiter_Bump.jpg");

const jupiter = new THREE.Mesh(
  new THREE.SphereGeometry(10, 400, 400),
  new THREE.MeshStandardMaterial({
    map: jupiterTexture,
    bumpMap: jupiterBump,
    bumpScale: 0.3,
  })
);

scene.add(jupiter);

jupiter.position.z = 90;
jupiter.position.setX(-20);

saturnRings.position.z = 60;
saturnRings.position.setX(6);
saturnRings.rotation.x = 5;
saturnRings.rotation.z = 5;

nicolas.position.z = -5;
nicolas.position.x = 2;

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.003;
  moon.rotation.y += 0.003;

  earth.rotation.y += 0.0041;
  earth.rotation.z += 0.00041;

  saturnRings.rotation.z += 0.0071;
  saturnPlanet.rotation.y += 0.0041;

  jupiter.rotation.y += 0.0041;

  nicolas.rotation.y += 0.01;

  camera.position.z = t * -0.03;
  camera.position.x = t * 0.002;
}

function moonOrbit() {}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.001;
  torus.rotation.y += 0.003;
  torus.rotation.z += 0.005;

  //controls.update();

  renderer.render(scene, camera);
}

animate();

//cool hacker effect thingy
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

document.querySelector("h1").onmouseover = (event) => {
  let iterations = 0;

  const interval = setInterval(() => {
    event.target.innerText = event.target.innerText
      .split("")
      .map((letter, index) => {
        if (index < iterations) {
          return event.target.dataset.value[index];
        }
        return letters[Math.floor(Math.random() * 26)];
      })
      .join("");

    if (iterations >= event.target.dataset.value.length) {
      clearInterval(interval);
    }

    iterations += 1 / 1.5;
  }, 30);
};

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import WebGL from "three/addons/capabilities/WebGL.js";
import { float } from "three/examples/jsm/nodes/Nodes.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.5,
  0
);
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas });
let controls;
controls = new OrbitControls(camera, canvas);
controls.maxDistance = 800;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
const loader = new GLTFLoader();
loader;
loader.load(
  "path/to/model.glb",
  function (gltf) {
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
/*wireframe/bg*/
const geometry = new THREE.SphereGeometry(500, 500, 500).scale(-1, 1, 1);
const wireframe = new THREE.WireframeGeometry(geometry);
const line = new THREE.LineSegments(wireframe);
line.material.depthTest = false;
line.material.opacity = 0.005;
line.material.transparent = true;
scene.add(line);
const texture = new THREE.TextureLoader().load("/asset/space.jpg");
const material = new THREE.MeshBasicMaterial({ map: texture });

const mesh = new THREE.Mesh(geometry, material);
const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 100);
scene.add(mesh);
scene.add(light);
camera.position.set(0, 0, 110);
light.position.set(0, 0, 2);

/*stars random*/
const radius = 0.5;
const segments = 32;
const vertices = [];

for (let i = 0; i < 10000; i++) {
  const x = THREE.MathUtils.randFloatSpread(800);
  const y = THREE.MathUtils.randFloatSpread(800);
  const z = THREE.MathUtils.randFloatSpread(800);
  vertices.push(x, y, z);
}
const geometrySpheres = new THREE.SphereGeometry(radius, segments, segments);
const materialSpheres = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 1,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  opacity: 0.4,
});
const spheres = new THREE.Group();

for (let i = 0; i < vertices.length; i += 3) {
  const sphere = new THREE.Mesh(geometrySpheres, materialSpheres);
  sphere.position.set(vertices[i], vertices[i + 1], vertices[i + 2]);
  spheres.add(sphere);
}
scene.add(spheres);
/*earth*/
const earthcenterOfOrbit = new THREE.Vector3(0, 0, 0);
const earthGeometry = new THREE.SphereGeometry(20, 20, 20); // Créer la géométrie de la sphère de la Terre
const earthtexture = new THREE.TextureLoader().load("/asset/earth.jpg");
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthtexture }); // Définir le matériau de la sphère de la Terre
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
const earthradius = 250;
const earthspeed = 0.0005;
scene.add(earth);

/*sun*/

const sunGeometry = new THREE.SphereGeometry(100, 100, 100);
const suntexture = new THREE.TextureLoader().load("/asset/sun.jpg");
const sunMaterial = new THREE.MeshBasicMaterial({ map: suntexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

/*Mercury*/
const mercurycenterOfOrbit = new THREE.Vector3(0, 0, 0);
const mercuryGeometry = new THREE.SphereGeometry(20, 20, 20);
const mercurytexture = new THREE.TextureLoader().load("/asset/mercury.jpg");
const mercuryMaterial = new THREE.MeshBasicMaterial({ map: mercurytexture });
const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
const mercuryradius = 100;
const mercuryspeed = 0.0002;
scene.add(mercury);
/*Mars*/
const marscenterOfOrbit = new THREE.Vector3(0, 0, 0);
const marsGeometry = new THREE.SphereGeometry(40, 40, 40);
const marstexture = new THREE.TextureLoader().load("/asset/mars.jpg");
const marsMaterial = new THREE.MeshBasicMaterial({ map: marstexture });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
const marsradius = 300;
const marsspeed = 0.0003;
scene.add(mars);
/*Aniamtion*/
function createAndAnimatePlanet(centerOfOrbit, radius, speed, planetObject) {
  const angle = performance.now() * speed;
  const orbitX = centerOfOrbit.x + Math.cos(angle) * radius;
  const orbitY = centerOfOrbit.y;
  const orbitZ = centerOfOrbit.z + Math.sin(angle) * radius;
  planetObject.position.set(orbitX, orbitY, orbitZ);
}
function Loop() {
  createAndAnimatePlanet(earthcenterOfOrbit, earthradius, earthspeed, earth);
  createAndAnimatePlanet(marscenterOfOrbit, marsradius, marsspeed, mars);
  createAndAnimatePlanet(
    mercurycenterOfOrbit,
    mercuryradius,
    mercuryspeed,
    mercury
  );
  requestAnimationFrame(Loop);
  mars.rotation.y = 0.001;
  earth.rotation.y += 0.01;
  sun.rotation.y += 0.0001;
  sun.rotation.z += 0.0001;
  sun.rotation.y += 0.0001;
  line.rotation.x += 0.0005;
  line.rotation.y += 0.0005;
  line.rotation.z += 0.0005;
  mesh.rotation.x -= 0.0005;
  mesh.rotation.y -= 0.0005;
  mesh.rotation.z -= 0.0005;
  spheres.rotation.x += 0.001;
  spheres.rotation.y += 0.001;
  spheres.rotation.z += 0.0;
  light.rotation.x += 0.0005;
  light.rotation.y += 0.0005;
  light.rotation.z += 0.0005;

  renderer.render(scene, camera);
  controls.update();
}

if (WebGL.isWebGLAvailable()) {
  Loop();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("container").appendChild(warning);
}
renderer.render(scene, camera);

loader.load(
  "path/to/model.glb",
  function (gltf) {
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

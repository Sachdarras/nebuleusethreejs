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

const geometry = new THREE.SphereGeometry(300, 300, 300).scale(-1, 1, 1);
const wireframe = new THREE.WireframeGeometry(geometry);
const line = new THREE.LineSegments(wireframe);
line.material.depthTest = false;
line.material.opacity = 0.1;
line.material.transparent = true;
scene.add(line);

const radius = 0.5;
const segments = 32;
const vertices = [];

for (let i = 0; i < 10000; i++) {
  const x = THREE.MathUtils.randFloatSpread(500);
  const y = THREE.MathUtils.randFloatSpread(500);
  const z = THREE.MathUtils.randFloatSpread(500);
  vertices.push(x, y, z);
}
const geometrySpheres = new THREE.SphereGeometry(radius, segments, segments);
const materialSpheres = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 10,
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

const textureEarth = new THREE.TextureLoader().load(
  "./asset/carte-du-monde-montrant-limites-plaques-tectoniques/5zhf_j24m_210430.jpg"
);
const geometryEarth = new THREE.SphereGeometry(150, 320, 160);
const materialEarth = new THREE.MeshBasicMaterial({ map: textureEarth });
const earth = new THREE.Mesh(geometryEarth, materialEarth);
scene.add(earth);

const texture = new THREE.TextureLoader().load("/asset/bgspace.jpg");
const material = new THREE.MeshBasicMaterial({ map: texture });

const mesh = new THREE.Mesh(geometry, material);
const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 100);
scene.add(mesh);
scene.add(light);
camera.position.set(0, 0, 110);
light.position.set(0, 0, 2);

function Loop() {
  requestAnimationFrame(Loop);
  line.rotation.x += 0.0005;
  line.rotation.y += 0.0005;
  line.rotation.z += 0.0005;
  mesh.rotation.x -= 0.0005;
  mesh.rotation.y -= 0.0005;
  mesh.rotation.z -= 0.0005;
  spheres.rotation.x -= 0.001;
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

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import WebGL from "three/addons/capabilities/WebGL.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { float } from "three/examples/jsm/nodes/Nodes.js";
/*tout les élements que l'on veu affiché dans la scéne*/

const scene = new THREE.Scene();

/*creation d'une caméra"*/
/*valeurde (focal, ratio de l'écran)*/
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
/*Création d'un élèment*/
/*tableau de points*/
const geometry = new THREE.SphereGeometry(100, 100, 100).scale(-1, 1, 1);
const wireframe = new THREE.WireframeGeometry(geometry);
const line = new THREE.LineSegments(wireframe);
line.material.depthTest = false;
line.material.opacity = 0.1;
line.material.transparent = true;
scene.add(line);
/*étoiles*/
const radius = 0.5; // Rayon de chaque sphère
const segments = 32; // Nombre de segments pour chaque sphère
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
/*Creation de texture*/
const texture = new THREE.TextureLoader().load("/asset/bgspace.jpg");
const material = new THREE.MeshBasicMaterial({ map: texture });

/* utilisantion de cette geométrie et ce shader*/
const mesh = new THREE.Mesh(geometry, material);
/*instancé une lumiére*/
const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 100);
/*instance àjouté à la scéne*/
scene.add(mesh);
/*ajout de la lumiére pour qu'elle soit prise en compte par leMR*/
scene.add(light);
/*position de la caméra*/
camera.position.set(0, 0, 50);
/*position de la lumiére*/
light.position.set(0, 0, 2);

/*Moteur de rendus*/
/* ({balise utilisée})*/

/*ajout de rotation*/
Loop();

function Loop() {
  requestAnimationFrame(Loop);
  line.rotation.x += 0.0005;
  line.rotation.y += 0.0005;
  line.rotation.z += 0.0005;
  mesh.rotation.x += 0.0005; // Ajout de la rotation à la sphère
  mesh.rotation.y -= 0.0005;
  mesh.rotation.z += 0.0005;
  spheres.rotation.x -= 0.001;
  spheres.rotation.y += 0.001;
  spheres.rotation.z += 0.0;
  light.rotation.x += 0.0005;
  light.rotation.y += 0.0005;
  light.rotation.z += 0.0005;
  renderer.render(scene, camera);
}

/*affichage on y instaure la scéne et la caméras*/
if (WebGL.isWebGLAvailable()) {
  // Initiate function or other initializations here
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

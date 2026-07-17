import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

(function () {
  "use strict";

  var container = document.getElementById("landModel");
  if (!container) return;

  var camera = new THREE.PerspectiveCamera(
    40,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  // ambient light (loads faster)
  var scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 4));

  var controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;   // inertia
  controls.enablePan = false;      // disable panning
  controls.enableZoom = false;     // disable zooming (no interference with scrolling)
  controls.autoRotate = true;      // rotates passively

  new GLTFLoader().load("assets/retro_computer_v2.glb", function (gltf) {
    var model = gltf.scene;

    // center model on origin and frame camera around it
    var box = new THREE.Box3().setFromObject(model);
    var center = box.getCenter(new THREE.Vector3());
    var sphere = box.getBoundingSphere(new THREE.Sphere());
    model.position.sub(center);
    scene.add(model);

    var fitDist =
      (sphere.radius / Math.sin((camera.fov * Math.PI) / 360)); // multiply by factor to change size

    camera.position
      .set(0.55, 0.35, 1)          // three-quarter view (it works ok)
      .normalize()
      .multiplyScalar(fitDist);
    camera.near = fitDist / 100;
    camera.far = fitDist * 100;
    camera.updateProjectionMatrix();

    controls.update();
  });

  function onResize() {
    var w = container.clientWidth;
    var h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);

  renderer.setAnimationLoop(function () {
    controls.update();
    renderer.render(scene, camera);
  });
})();

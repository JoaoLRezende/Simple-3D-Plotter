"use strict";

// Configurable constants.   TODO: move these to a separate module and reorganize them there.
const FIELD_OF_VIEW = 45;   // in degrees
const BACKGROUND_COLOR = "black";
const AXES_COLOR = "white";
const GRAPH_COLOR = "red";
const CAMERA_POSITION = [0, 5, 10];
// width, height and depth of the cuboid that contains the graph
const WINDOW_DIMENSIONS = [5, 5, 1];
const WINDOW_XZ_RESOLUTION = [40, 1];
const testFunction = function(x, z) { return Math.sin(x) };

let scene, camera, renderer;
let surfaceMaterial, surface;

init();

function init() {
    const canvasDiv = document.querySelector("#canvas-div");

    scene = new THREE.Scene();

    scene.background = new THREE.Color(BACKGROUND_COLOR);

    camera = new THREE.PerspectiveCamera(
        FIELD_OF_VIEW,
        canvasDiv.clientWidth / canvasDiv.clientHeight,
        0.1,     // near-clipping-plane distance
        100      // far-clipping-plane distance
    );
    camera.position.set(...CAMERA_POSITION);
    camera.lookAt(0, 0, 0);

    createParametricSurface();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(canvasDiv.clientWidth, canvasDiv.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Add the created canvas element to the page.
    canvasDiv.appendChild(renderer.domElement);

    requestAnimationFrame(updateScene);
}

function createParametricSurface() {
    let paramFunction = function(u, v, position) {
        let x = -WINDOW_DIMENSIONS[0]/2 + u*(WINDOW_DIMENSIONS[0]);
        let z = -WINDOW_DIMENSIONS[2]/2 + v*(WINDOW_DIMENSIONS[2]);
        
        let y = testFunction(x, z);

        position.set(x, -y, z);
        console.log("resulting position:", position);
    };
    let geometry = new THREE.ParametricBufferGeometry(paramFunction, ...WINDOW_XZ_RESOLUTION);
    let material = new THREE.MeshBasicMaterial({
        color: GRAPH_COLOR
    });
    surface = new THREE.Mesh(geometry, material);
    surface.rotation.set(-Math.PI, -Math.PI, 0);
    scene.add(surface);
}

function updateScene(time) {
    time /= 1000;


    renderer.render(scene, camera);
    requestAnimationFrame(updateScene);
}
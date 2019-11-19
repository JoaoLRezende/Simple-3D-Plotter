"use strict";

// Configurable constants.   TODO: move these to a separate module and reorganize them there.
const FIELD_OF_VIEW = 45;   // in degrees
const BACKGROUND_COLOR = "black";
const AXES_COLOR = "white";
const GRAPH_COLOR = "red";
const CAMERA_POSITION = [0, 5, 10];
// width and depth of the cuboid that contains the graph
const WINDOW_DIMENSIONS = [5, 1];
const WINDOW_XZ_RESOLUTION = [40, 1];
const GRAPH_MORPH_TIME = 0.5;   // in seconds

let scene, camera, renderer;
let surface;

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

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(canvasDiv.clientWidth, canvasDiv.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Add the created canvas element to the page.
    canvasDiv.appendChild(renderer.domElement);

    let cameraControls = new THREE.OrbitControls(camera, canvasDiv);
    cameraControls.maxPolarAngle = Math.PI/3;

    createParametricSurface();
    drawNewFunction((x, z) => 0);
}

function createParametricSurface() {
    updateScene.oldFunction = function(x, z) {return 0};
    updateScene.targetFunction = updateScene.oldFunction;

    let geometry = new THREE.PlaneBufferGeometry(WINDOW_XZ_RESOLUTION);
    let material = new THREE.MeshBasicMaterial({
        color: GRAPH_COLOR
    });
    surface = new THREE.Mesh(geometry, material);
    surface.rotation.set(-Math.PI, -Math.PI, 0);
    scene.add(surface);
}

function drawNewFunction(f) {
    updateScene.newFunction = f;
    requestAnimationFrame(updateScene);
}

function updateScene(time) {
    time /= 1000;

    /* If updateScene.newFunction is not null, then it holds
     * a function that shall become the new target function. Start
     * morphing the graph towards it.
     */
    if (updateScene.newFunction) {
        updateScene.oldFunction = updateScene.targetFunction;
        updateScene.targetFunction = updateScene.newFunction;
        updateScene.morphStartTime = time;
        updateScene.newFunction = null;
    }

    let progress = Math.min(1, (time - updateScene.morphStartTime) / GRAPH_MORPH_TIME);

    surface.geometry.dispose();
    let paramFunction = function(u, v, position) {
        let x = -WINDOW_DIMENSIONS[0]/2 + u*(WINDOW_DIMENSIONS[0]);
        let z = -WINDOW_DIMENSIONS[1]/2 + v*(WINDOW_DIMENSIONS[1]);
        
        let y = (1-progress)*updateScene.oldFunction(-x, z)
                +  progress *updateScene.targetFunction(-x, z);

        position.set(x, -y, z);
    };
    surface.geometry = new THREE.ParametricBufferGeometry(paramFunction, ...WINDOW_XZ_RESOLUTION);

    renderer.render(scene, camera);

    requestAnimationFrame(updateScene);
}
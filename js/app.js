"use strict";

// Constants.   TODO: move these to a separate module and reorganize them there.
const FIELD_OF_VIEW = 95;   // in degrees
const BACKGROUND_COLOR = "black";
const AXES_COLOR = "white";
const CAMERA_POSITION = [0, 50, 50];
// width, height and depth of the cuboid that contains the graph
const WINDOW_DIMENSIONS = [10, 10, 10];

let scene, renderer;

function init() {
    const canvasDiv = document.querySelector("#canvas-div");

    scene = new THREE.Scene();

    scene.background = new THREE.Color(BACKGROUND_COLOR);

    const camera = new THREE.PerspectiveCamera(
        FIELD_OF_VIEW,
        canvasDiv.clientWidth / canvasDiv.clientHeight,
        0.1,     // near-clipping-plane distance
        100      // far-clipping-plane distance
    );
    camera.position.set(...CAMERA_POSITION);
    camera.lookAt(0, 0, 0);

    createAxes();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(canvasDiv.clientWidth, canvasDiv.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Add the created canvas element to the page.
    canvasDiv.appendChild(renderer.domElement);

    renderer.render(scene, camera);
}

/*
 * Create lines representing the coordinate system's axes and add them to the
 * scene.
 */
function createAxes() {
    // TODO: make this function draw the other axes, too. (Note that you shouldn't need to duplicate any code here. Use a for loop.)
    let material = new THREE.LineBasicMaterial({color: AXES_COLOR});

    let geometry = new THREE.Geometry();
    geometry.vertices = [new THREE.Vector3(-WINDOW_DIMENSIONS[0] / 2, 0, 0),
                         new THREE.Vector3(0                        , 0, 0),
                         new THREE.Vector3( WINDOW_DIMENSIONS[0] / 2, 0, 0)];
    let line = new THREE.Line(geometry, material);

    scene.add(line);
}

init();
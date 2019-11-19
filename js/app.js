"use strict";

// Configurable constants.   TODO: move these to a separate module and reorganize them there.
const FIELD_OF_VIEW = 45;   // in degrees
const BACKGROUND_COLOR = "black";
const AXES_COLOR = "white";
const GRAPH_COLOR = "red";
const CAMERA_POSITION = [0, 10, 20];
// width, height and depth of the cuboid that contains the graph
const WINDOW_DIMENSIONS = [10, 1, 10];
const WINDOW_XZ_RESOLUTION = [100, 10];
const testFunction = function(x, z) { return (Math.sin(x)) };

// Derived constants and other objects.
const rectangleGrid = Array.from(Array(WINDOW_XZ_RESOLUTION[0]),
                                 () => new Array(WINDOW_XZ_RESOLUTION[1]));
const rectangleDimensions = [WINDOW_DIMENSIONS[0] / WINDOW_XZ_RESOLUTION[0],
                             WINDOW_DIMENSIONS[2] / WINDOW_XZ_RESOLUTION[1]];

let scene, camera, renderer;

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

    createRectangles();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(canvasDiv.clientWidth, canvasDiv.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Add the created canvas element to the page.
    canvasDiv.appendChild(renderer.domElement);

    requestAnimationFrame(updateScene);
}

function createRectangles() {
    let rectangleGeometry = new THREE.PlaneGeometry(...rectangleDimensions);
    let rectangleMaterial = new THREE.MeshBasicMaterial({
        color: GRAPH_COLOR
    });

    let initialX = -WINDOW_DIMENSIONS[0]/2 + rectangleDimensions[0] / 2;
    let initialZ = -WINDOW_DIMENSIONS[2]/2 + rectangleDimensions[1] / 2
    for (let x_i = 0; x_i < WINDOW_XZ_RESOLUTION[0]; x_i += 1) {
        for (let z_i = 0; z_i < WINDOW_XZ_RESOLUTION[1]; z_i += 1) {
            rectangleGrid[x_i][z_i] = new THREE.Mesh(rectangleGeometry,
                                                rectangleMaterial);
            scene.add(rectangleGrid[x_i][z_i]);
            rectangleGrid[x_i][z_i].position.set(
                initialX + rectangleDimensions[0]*x_i,
                0,
                initialZ + rectangleDimensions[1]*z_i);
            rectangleGrid[x_i][z_i].rotation.x = -Math.PI / 2;
        }
    }   
}

function updateScene(time) {
    time /= 1000;

    let initialX = -WINDOW_DIMENSIONS[0]/2 + rectangleDimensions[0] / 2;
    let initialZ = -WINDOW_DIMENSIONS[2]/2 + rectangleDimensions[1] / 2
    for (let x_i = 0; x_i < WINDOW_XZ_RESOLUTION[0]; x_i += 1) {
        for (let z_i = 0; z_i < WINDOW_XZ_RESOLUTION[1]; z_i += 1) {
            let x = initialX + x_i*rectangleDimensions[0];
            let z = initialZ + z_i*rectangleDimensions[1];

            rectangleGrid[x_i][z_i].position.y = testFunction(x, z);
            console.log(x, z, rectangleGrid[x_i][z_i].position.y);
        }
    }   

    renderer.render(scene, camera);
    // requestAnimationFrame(updateScene);
}
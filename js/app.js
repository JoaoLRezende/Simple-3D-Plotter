"use strict";

// Configurable constants.   TODO: move these to a separate module and reorganize them there.
const FIELD_OF_VIEW = 90;   // in degrees
const BACKGROUND_COLOR = "black";
const AXES_COLOR = "white";
const GRAPH_COLOR = "red";
const CAMERA_POSITION = [0, 5, 10];
// width and depth of the cuboid that contains the graph
const WINDOW_DIMENSIONS = [10, 10];
const WINDOW_XZ_RESOLUTION = [40, 40];
const GRAPH_MORPH_TIME = 0.5;   // in seconds

let scene, camera, renderer;
let surface;
let keepRedrawing = false;

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
    drawNewFunction({target : {value: "0"}});
}

function createParametricSurface() {
    updateScene.oldFunction = function(x, z) {return 0};
    updateScene.targetFunction = updateScene.oldFunction;

    let geometry = new THREE.PlaneBufferGeometry(WINDOW_XZ_RESOLUTION);
    geometry = new THREE.WireframeGeometry(geometry);   // temp
    let material = new THREE.MeshBasicMaterial({
        color: GRAPH_COLOR
    });
    surface = new THREE.LineSegments(geometry, material);   // temporarily using LineSegments instead of Mesh, for showing depth
    surface.rotation.set(-Math.PI, -Math.PI, 0);
    scene.add(surface);
}

function drawNewFunction(e) {
    let f;

    try {
        f = eval("(x,z) => (" + e.target.value + ")");
    } catch (err) {
        console.log(err);
        return;
    }

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
        
        let y = (1-progress)*updateScene.oldFunction(-x, -z)
                +  progress *updateScene.targetFunction(-x, -z);

        position.set(x, -y, z);
    };
    surface.geometry = new THREE.ParametricBufferGeometry(paramFunction, ...WINDOW_XZ_RESOLUTION);

    renderer.render(scene, camera);

    if (progress < 1 || keepRedrawing)
        requestAnimationFrame(updateScene);
}

function onClick(event) {
    /*
     * If the user has clicked the screen, they might be trying to
     * move the camera around; so we'll start updating the screen
     * to let them see the sweet camera movements they crave.
     * (Unfortunately, this gets called _after_ they press and stop pressing
     * their right mouse button, which results in some unexpected behavior
     * when the user first clicks on the screen.)
     */
    keepRedrawing = true;
    requestAnimationFrame(updateScene);
};

function onMouseOut(event) {
    /* If the user has moved their cursor away from the canvas, then they
     * aren't trying to move the camera anymore. Stop updating the screen.
     * (It would be preferable to do this when they let go of their right mouse
     * button, but I don't know how to do that.)
     */
    keepRedrawing = false;
}
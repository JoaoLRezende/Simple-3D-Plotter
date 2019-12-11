"use strict";

let scene, camera, renderer;
let surface;

/* keepRedrawing is true when, and only when, the user is
 * pressing down the mouse's left button, which means they might
 * be trying to move the camera. In that case, we keep updating
 * the screen even if not in the middle of a transition nor
 * drawing an animated function.
 */
let keepRedrawing = true;

function init() {
    document.querySelector("#function-box").focus();

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
    if (AVOID_USELESS_REDRAWING) {
        keepRedrawing = false;
        
        canvasDiv.addEventListener("mousedown", function() {
            /*
             * If the user has clicked the screen, they might be trying to
             * move the camera around; so we'll start updating the screen
             * to let them see the sweet camera movements they crave.
             */
            keepRedrawing = true;
            requestAnimationFrame(updateScene);
        });
        canvasDiv.addEventListener("mouseup", function() {
            /* If the user has released their right mouse button, then they
             * aren't trying to move the camera anymore. Stop updating the screen.
             */
            keepRedrawing = false;
        });
    }

    createWindowEdges();
    createParametricSurface();
    drawNewFunction({target : {value: "0"}});
}

function createWindowEdges() {
    let rectangleGeometry =
                        new THREE.PlaneBufferGeometry(...WINDOW_DIMENSIONS);
    let edgesGeometry = new THREE.EdgesGeometry(rectangleGeometry);
    let material = new THREE.LineBasicMaterial({color : AXES_COLOR});
    let rectangle = new THREE.LineSegments(edgesGeometry, material);
    rectangle.rotation.x = Math.PI / 2;
    scene.add(rectangle);
}

function createParametricSurface() {
    updateScene.oldFunction = function(x, z) {return 0};
    updateScene.currentFunction = updateScene.oldFunction;

    let geometry = new THREE.PlaneBufferGeometry(WINDOW_XZ_RESOLUTION);
    geometry = new THREE.WireframeGeometry(geometry);   // temp
    let material = new THREE.MeshBasicMaterial({
        color: GRAPH_COLOR
    });
    surface = new THREE.LineSegments(geometry, material);   // temporarily using LineSegments instead of Mesh to show depth
    surface.rotation.set(-Math.PI, -Math.PI, 0);
    scene.add(surface);
}


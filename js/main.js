"use strict";

let scene, camera, renderer;
let surface;
let keepRedrawing = true;

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

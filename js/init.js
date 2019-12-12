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

    if (SHOW_GRID) createGrid();
    createLights();
    createWindowEdges();
    createParametricSurface();
    createTicks();
    drawNewFunction({target : {value: "0"}});
    if (PRESS_N_TO_CYCLE) enableFunctionCycling();
}

function createGrid() {
    let initialZ = WINDOW_DIMENSIONS[1]/2
    for (let z  = initialZ; z >= -initialZ; z -= 1) {
        let grid = new THREE.GridHelper(WINDOW_DIMENSIONS[0], 10);
        grid.position.set(0, 0, z)
        grid.rotation.x = Math.PI/2;
        scene.add(grid);
    }
    requestAnimationFrame(updateScene);
}

function createLights() {
    let pointLight = new THREE.PointLight(POINT_LIGHT_COLOR,
                                          POINT_LIGHT_INTENSITY,
                                          0,
                                          POINT_LIGHT_DECAY);
    pointLight.position.set(...POINT_LIGHT_POSITION);
    scene.add(pointLight);

    let hemisphereLight = new THREE.HemisphereLight(TOP_COLOR,
                                                    GROUND_COLOR,
                                                    HEMISPHERE_LIGHT_INTENSITY);
    scene.add(hemisphereLight);
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
    updateScene.oldFunction = updateScene.currentFunction =
        function(x, z) {return 0};

    let geometry = new THREE.PlaneBufferGeometry(WINDOW_XZ_RESOLUTION);
    let material = new THREE.MeshStandardMaterial({
        color: GRAPH_COLOR
    });
    material.side = THREE.DoubleSide;
    surface = new THREE.Mesh(geometry, material);
    surface.rotation.set(-Math.PI, -Math.PI, 0);
    scene.add(surface);
}

function createTicks() {
    new THREE.FontLoader().load("fonts/optimer_regular.typeface.json",
                                function(font) {
        TICK_LABEL_PARAMETERS.font = font;

        let tickMaterial = new THREE.LineBasicMaterial({ color: AXES_COLOR });
        let labelMaterial = new THREE.MeshBasicMaterial({ color: AXES_COLOR });

        /* Create the x axis' ticks and their labels. */
        let xTickGeometry = new THREE.Geometry();
        xTickGeometry.vertices.push(new THREE.Vector3(0, 0, 0),
                                    new THREE.Vector3(0, -TICK_LENGTH, 0));

        let initialX = -Math.floor(WINDOW_DIMENSIONS[0]/2) + 1;
        for (let x = initialX; x <= WINDOW_DIMENSIONS[0]/2 - 1; x += 1) {
            let tick = new THREE.Line(xTickGeometry, tickMaterial);
            tick.position.set(x, 0, WINDOW_DIMENSIONS[1]/2);
            scene.add(tick);

            let numberGeometry = new THREE.TextBufferGeometry(
                String(x), TICK_LABEL_PARAMETERS
            );
            let number = new THREE.Mesh(numberGeometry, labelMaterial);
            number.position.set(
                x - TICK_LABEL_PARAMETERS.size/2 * 0.8,
                -TICK_LENGTH - TICK_LABEL_PARAMETERS.size,
                WINDOW_DIMENSIONS[1]/2);
            scene.add(number);
        }

        /* Create the z axis' tick and their labels. */
        let zTickGeometry = new THREE.Geometry();
        zTickGeometry.vertices.push(new THREE.Vector3(0, 0, 0),
                                      new THREE.Vector3(0, -TICK_LENGTH, 0)); // TODO: this is unnecessarily duplicated.

        let initialZ = -Math.floor(WINDOW_DIMENSIONS[1]/2) + 1;
        for (let z = initialZ; z <= WINDOW_DIMENSIONS[1]/2 - 1; z += 1) {
            let tick = new THREE.Line(zTickGeometry, tickMaterial);
            tick.position.set(WINDOW_DIMENSIONS[0]/2, 0, z);
            scene.add(tick);

            let numberGeometry = new THREE.TextBufferGeometry(
                String(z), TICK_LABEL_PARAMETERS
            );
            let number = new THREE.Mesh(numberGeometry, labelMaterial);
            number.position.set(
                WINDOW_DIMENSIONS[0]/2,
                -TICK_LENGTH - TICK_LABEL_PARAMETERS.size,
                z + TICK_LABEL_PARAMETERS.size/2 * 0.8);
            number.rotation.y = Math.PI / 2;
            scene.add(number);
        }
        
        requestAnimationFrame(updateScene);
    });
}
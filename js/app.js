"use strict";

function init() {
    const canvasDiv = document.querySelector("#canvas-div");

    const scene = new THREE.Scene();

    scene.background = new THREE.Color("skyblue");

    const camera = new THREE.PerspectiveCamera(
        35,                                                 // field of fiew, in degrees
        canvasDiv.clientWidth / canvasDiv.clientHeight,     // aspect ratio
        0.1,                                                // near-clipping-plane distance
        100                                                 // far-clipping-plane distance
    );
    camera.position.set( 0, 0, 10 );

    const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(canvasDiv.clientWidth, canvasDiv.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Add the created canvas element to the page.
    canvasDiv.appendChild(renderer.domElement);

    renderer.render(scene, camera);
}

init();
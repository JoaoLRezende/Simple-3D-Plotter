"use strict";

/* Declared in init.js but also used in this file:
 * scene, camera, renderer, surface, keepRedrawing.
 */


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
        
        let y = (1-progress)*updateScene.oldFunction(-x, -z, time)
                +  progress *updateScene.targetFunction(-x, -z, time);

        position.set(x, -y, z);
    };
    surface.geometry = new THREE.ParametricBufferGeometry(paramFunction, ...WINDOW_XZ_RESOLUTION);

    renderer.render(scene, camera);

    if (progress < 1 || keepRedrawing)
        requestAnimationFrame(updateScene);
}

function drawNewFunction(e) {
    let f;

    try {
        f = eval("(x, z, t) => (" + e.target.value + ")");
    } catch (err) {
        console.log(err);
        return;
    }

    updateScene.newFunction = f;
    requestAnimationFrame(updateScene);
}

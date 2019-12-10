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
        updateScene.oldFunction = updateScene.currentFunction;
        updateScene.currentFunction = updateScene.newFunction;
        updateScene.morphStartTime = time;
        updateScene.newFunction = null;
    }

    let progress = Math.min(1, (time - updateScene.morphStartTime) / GRAPH_MORPH_TIME);

    surface.geometry.dispose();
    let paramFunction = function(u, v, position) {
        let x = -WINDOW_DIMENSIONS[0]/2 + u*(WINDOW_DIMENSIONS[0]);
        let z = -WINDOW_DIMENSIONS[1]/2 + v*(WINDOW_DIMENSIONS[1]);
        
        let y = (1-progress)*updateScene.oldFunction(-x, -z, time)
                +  progress *updateScene.currentFunction(-x, -z, time);

        position.set(x, -y, z);
    };
    surface.geometry = new THREE.ParametricBufferGeometry(
        paramFunction,
        ...WINDOW_XZ_RESOLUTION
        );

    renderer.render(scene, camera);

    if (progress < 1
        || updateScene.currentFunction.isFunctionOfTime
        || keepRedrawing)
        requestAnimationFrame(updateScene);
    else
        console.log("OK, dying now.");
}

function drawNewFunction(e) {
    let f;

    try {
        f = eval("(x, z, t) => (" + e.target.value + ")");
    } catch (err) {
        console.log(err);
        return;
    }

    f.isFunctionOfTime = isFunctionOfTime(f);
    updateScene.newFunction = f;
    requestAnimationFrame(updateScene);
}

/* isFunctionOfTime determines, in a fairly retarded manner, whether
 * a function changes with time.
 */
function isFunctionOfTime(f) {
    if (f(4, 8, 0) == f(4, 8, 1)
        && f(4, 8, 0) == f(4, 8, 1.1)
        && f(9, -2, 9) == f(9, -2, 10.5)) {
        console.log("Not a function of time.");
        return false;
    } else {
        console.log("That's a function of time.");
        return true;
    }
}

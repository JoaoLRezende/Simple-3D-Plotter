const FIELD_OF_VIEW = 90;   // in degrees

const BACKGROUND_COLOR = "black";
const AXES_COLOR = "white";
const GRAPH_COLOR = "red";

const CAMERA_POSITION = [0, 3, 15];

// width and depth of the cuboid that contains the graph
const WINDOW_DIMENSIONS = [20, 10];

const WINDOW_XZ_RESOLUTION = [100, 30];

const GRAPH_MORPH_TIME = 0.8;   // in seconds

const AVOID_USELESS_REDRAWING = true;   // messes up zooming but saves energy and makes my PC freeze less

const TICK_LENGTH = 0.25;
const TICK_LABEL_PARAMETERS = {
    size: 0.35,
    height: 0.001,
    curveSegments: 12
    // TODO: experiment with bevelling.
};

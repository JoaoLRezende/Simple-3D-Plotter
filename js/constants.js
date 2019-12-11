const FIELD_OF_VIEW = 90;   // in degrees

const BACKGROUND_COLOR = "black";
const AXES_COLOR = "white";
const GRAPH_COLOR = "white";

const CAMERA_POSITION = [0, 3, 15];

const POINT_LIGHT_POSITION = [10, 10, 10];
const POINT_LIGHT_COLOR = "white";
const POINT_LIGHT_INTENSITY = 1;
const POINT_LIGHT_DECAY = 1;

const HEMISPHERE_LIGHT_INTENSITY = 1;
const TOP_COLOR = "red";
const GROUND_COLOR = "blue";

// width and depth of the cuboid that contains the graph
const WINDOW_DIMENSIONS = [20, 10];

const WINDOW_XZ_RESOLUTION = [100, 50];

const GRAPH_MORPH_TIME = 0.8;   // in seconds

const AVOID_USELESS_REDRAWING = true;   // messes up zooming but saves energy and makes my PC freeze less

const TICK_LENGTH = 0.25;
const TICK_LABEL_PARAMETERS = {
    size: 0.35,
    height: 0.001,
    curveSegments: 12
    // TODO: experiment with bevelling.
};

const PRESS_N_TO_CYCLE = false; // prevents you from typing into the input field manually, for some reason. :C

const SHOW_GRID = false; // is useless and looks terrible, but was in the specification lol
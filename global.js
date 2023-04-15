// document.oncontextmenu = function() { return false; }
// p5.disableFriendlyErrors = true; // disables FES



// SCENE
let drawPlan = false; // DETERMINE DEFAULT/START-SCENE

// SCALING
let SCALE_TO, SCL, UI_SCL, UI_PADDING, MM_PIX_RATIO;

// VARIOUS
const BACKGROUND_COLOR = [202, 2, 100];
let casket;
let plan;
let ruler;
let rulerModelStructure;
let rulerModelMarkings;
let coin;
let coins = [];
let arrow;
let cam;
let textF;
let fpsArr = [];
let fpsAvg = 0;

// PIX DENS CHANGE
let PIX_DENS_INIT;
let PIX_DENS_MIN;
const PIX_DENS_MIN_DIV = 2.5;
let camReset = null; // SETS TO MILLIS() VALUE WHEN CAM IS RESET IN EASYCAM.JS - AT TWO LOCATIONS!
let timeSincePixDensChange = 0;
let pixDensChangePending = false;
let newPixDens;
let drawPaused = false;

// USER INPUT
let tapRegistred;
let tapTime = -1;
let tapPos = null;
let numTaps = -1; // TOUCH/MOUSE "TIME PRESSED"
let uiSelectActive = false;
let uiSelectJustClosed = 0;

// CASKET DIMENSIONS/VISUALS
let CASKET_COLOR_INIT = [31, 35, 50];
const CASKET_SIZE_RATIO = 0.75; // CASKET SIZE TO SCREEN RATIO
const CASKET_WIDTH_INIT = 60;
const CASKET_HEIGHT_INIT = 40;
const CASKET_DEPTH_INIT = 50
const CASKET_THICKNESS_INIT = 6;
const CASKET_WIDTH_MIN = 50;
const CASKET_HEIGHT_MIN = 40;
const CASKET_DEPTH_MIN = 50;
const CASKET_THICKNESS_MIN = 5;
const CASKET_WIDTH_MAX = 200;
const CASKET_HEIGHT_MAX = 80;
const CASKET_DEPTH_MAX = 200;
const CASKET_THICKNESS_MAX = 12;

// MATERIALS
let MATERIAL_INIT;
let ashTexture;
let birchPlywoodTexture;
let cherryTexture;
let mapleTexture;
let oliveTexture;
let walnutTexture;

// EASYCAM
const CAM_TRANSITION_TIME = 600;
const CAM_ROTATION_INIT = [1, -0.3, 0.259, 0];
const PLAN_CAM_ROTATION_INIT = [1, 0, -0.35, 0];
// const PLAN_CAM_ROTATION_INIT = [1, -0.2, 0.259, 0]
const START_ANIM_LENGTH = 400;
let camState, prevCamState;

// DEBUGGING
let fpsInfoText = '--';




function preload() {
  // FONT
  textF = loadFont('_assets/jetbrains.ttf');
  
  // TEXTURES
  ashTexture = loadImage('_assets/_textures/ash_04.jpg');
  birchTexture = loadImage('_assets/_textures/birch_02.jpg');
  cherryTexture = loadImage('_assets/_textures/cherry_05.jpg');
  mapleTexture = loadImage('_assets/_textures/maple_03.jpg');
  oliveTexture = loadImage('_assets/_textures/olive_01.jpg');
  walnutTexture = loadImage('_assets/_textures/walnut_04.jpg');
  // Endgrain
  endgrainTexture = loadImage('_assets/_textures/walnut_endgrain_03.jpg');
  
  // MODELS
  coinModel = loadModel('_assets/coin_30mm.obj');
  rulerModelStructure = loadModel('_assets/ruler_structure.obj');
  rulerModelMarkings = loadModel('_assets/ruler_markings.obj');
  arrow1headModel = loadModel('_assets/arrow_1head_50mm.obj');
  arrow2headsModel = loadModel('_assets/arrow_2heads_100mm.obj');
}



















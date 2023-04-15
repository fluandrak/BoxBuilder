function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 100);
  angleMode(DEGREES);
  textureMode(NORMAL);
  // blendMode(SUBTRACT);
  
  PIX_DENS_MIN = pixelDensity() / PIX_DENS_MIN_DIV;
  pixelDensity(pixelDensity()*0.85); // iPhone 13: 3  /  MateBook: 2
  PIX_DENS_INIT = pixelDensity();
  
  SCALE_TO = width > height ? height : width;
  SCL = SCALE_TO * 0.0003;
  UI_SCL = SCL * 14;
  UI_PADDING = UI_SCL * 5;
  
  MM_PIX_RATIO = SCALE_TO * CASKET_SIZE_RATIO / 100;
  MATERIAL_INIT = walnutTexture;
  
  // INIT ORDER CRUCIAL ====>
  
  // CASKET OBJECT INIT
  casketInit();
  
  // PLAN OBJECT INIT
  planInit();
  
  // CAM OBJECT INIT
  cam = createEasyCam({rotation: CAM_ROTATION_INIT});
  camUpdate();
  
  // RULER OBJECT INIT
  ruler = new Ruler();
  
  // COIN OBJECT INIT
  coinInit();
  
  // ARROW OBJECT INIT
  arrow = new Arrow();

  // TEXT SETUP
  defaultTextSetup();
  
  // USER INTERFACE INIT
  uiInit();
  ui();

  // // WAIT FOR CAM INIT
  // while (CAM_TRANSITION_TIME*1.5 > millis()) {
  // }
  prevCamState = cam.getState();
}



function draw() {
  if (! drawPlan) {
    drawDesignScene();
  } else {
    drawPlanScene();
  }
}

















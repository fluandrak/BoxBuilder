let pixDensControl = (centerColor) => {
  if (millis() < CAM_TRANSITION_TIME*2) return; // SKETCH LAUNCH DELAY
  
  let distance = cam.getDistance();
  let currPd = pixelDensity();
  
  let casketVol = Math.sqrt(Math.sqrt(casket.width*casket.height*casket.depth)*0.0055);
  
  let newPd = distance*0.0018/casketVol * PIX_DENS_INIT;
  if (fpsAvg === 0) fpsAvg = 60;
  let adjustToFps = fpsAvg / 70;
  
  newPd += adjustToFps;
  
  if (newPd > PIX_DENS_INIT) newPd = PIX_DENS_INIT;
  if (newPd < PIX_DENS_MIN) newPd = PIX_DENS_MIN;

  if (newPd < currPd*0.9 || newPd > currPd*1.1 ) { // 0.9 / 1.1 

    if (millis() - timeSincePixDensChange > 300) {
      pixDensChangePending = true;
      newPixDens = newPd;
    }
  }
}



let pixDensApplyChange = () => {
  drawPaused = true;
  pixelDensity(newPixDens);
  drawPaused = false;
  timeSincePixDensChange = millis();
}



let camUpdatePixDensControl = () => {
  if (camReset && millis() - camReset > CAM_TRANSITION_TIME) {
    pixDensControl();
    return true;
  }
}



let pixDensDrawChecks = (skipDrawPixDensControl) => {
  if (skipDrawPixDensControl) camReset = null;
  if (! camReset) pixDensControl(); // NO PIXEL DENSITY CHANGE DURING CAMRESET ANIMATION
}



let centerPixBlack = () => {
  // DID drawGraphics "FAIL WITH CAM"? - BLACK SCREEN (center dot) CHECK
  // ... - IF SO DRAW GRAPHICS
  let centerP = get(width/2, height/2);
  return (centerP[0] + centerP[1] + centerP[2] + centerP[3] == 0);
}




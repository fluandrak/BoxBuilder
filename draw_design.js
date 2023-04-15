let drawDesignScene = () => {
  // if (casket.lid.display) inputControl();
  inputControl();
  
  let skipDrawPixDensControl = camUpdatePixDensControl();

  if (! drawPaused || centerPixelBlack()) {
    // DRAW IF NOT PAUSED FOR PIXEL DENSITY CHANGE...
    // ...OR CENTER PIXEL IS BLACK (pixel density change "failed")
    
    camState = cam.getState();
    if (! casket.lid.rotation.static ||
        (casket.lidOpen() && coin.display) ||
        camChanged(camState, prevCamState) ||
        casket.render.animateDimension.dimension ||
        centerPixBlack()
       )
    {
      background(BACKGROUND_COLOR);
      drawAllGraphics();
      pixDensDrawChecks(skipDrawPixDensControl);
      // doExperimental();
    }
  }
  // drawDebugText();
  
  if (frameCount % 10 == 0) fpsAvgCalculate(); // NOT ONLY USED FOR drawDebugText() !!!!!
  if (frameCount % 30 == 0 && pixDensChangePending) pixDensApplyChange();
  
  cam.beginHUD();   // 'cam.begin-/endHUD()' = WORKAROUND FOR CAMSTATE COMPARISON CHECK ABOVE - FAILS OTHERWISE ON MOBILE/IPHONE FOR SOME REASON (IF NOT drawDebugText() IS ACTIVE - WHICH IN TURN USES begin-/endHUD)
  cam.endHUD();
  
  prevCamState = camState;
};



let drawAllGraphics = () => {
  drawLights();
  casket.update();
  casket.draw();
  
  arrow.draw();
  
  if (! uiSelectActive) {
    if (ruler.display) {
      drawCasketInfoText();
      ruler.update();
      ruler.draw();
    }
    if (coin.display) drawCoin();
  }
}



let drawCoin = () => {
  if (!casket.lidClosed || !casket.hasLid) {
    for (let coinRow of coins) {
      for (let coin of coinRow) {
        coin.draw();
      }
    }
  }
}



let drawLights = () => {
  // ambientLight(70);
  // let dlMag = 0.99;
  ambientLight(90);
  let dlMag = 0.90;
  directionalLight(0, 0, 58*dlMag, 0, 0, width);
  directionalLight(0, 0, 74*dlMag, width, 0, -width);
  directionalLight(0, 0, 78*dlMag, -width, -height, -width);
  directionalLight(0, 0, 91*dlMag, 0, height*4, width);
  pointLight(0, 0, 10*dlMag, casket.width, -casket.height*2, -casket.depth);
}



// let drawUiText = () => {
//   push();
//   cam.beginHUD();
//   // translate(width/2, height-lidCheckbox.height-UI_PADDING*2);
//   translate(lidCheckbox.x - lidCheckbox.height/1.3, lidCheckbox.y + (lidCheckbox.height*UI_SCL/1.5));
//   rotate(-90);
//   textSize(mm2pix(5.5));
//   textAlign(LEFT);
//   fill(0);
//   text('Lid', 0, 0);
//   cam.endHUD();
//   pop();
// }



let drawCasketInfoText = () => {
  
  push();
  textAlign(LEFT);
  // Translate to below ruler
  translate(-casket.width/2, casket.box.height, casket.depth/2);
  translate(0, 0.5, mm2pix(26));
  
  rotateX(90);
  
  // CASKET INNER DIMENSIONS & VOLUME INFO
  textSize(casket.infoText.size*0.8);
  // fill(casket.infoText.fillColor);
  fill(0);
  text(casket.infoText.text1 + ' ' + casket.infoText.text2, 0, 0);

  pop();
  
}




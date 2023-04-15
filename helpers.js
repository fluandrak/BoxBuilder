let fpsAvgCalculate = () => {
  fpsArr.push(frameRate());
  
  if (fpsArr.length > 10) {
    let total = 0;
    for (let a of fpsArr) {
      total += a;
    }
    fpsAvg = floor(total / fpsArr.length);
    fpsArr.shift();
  }
}



let mm2pix = (dimension) => {
  return dimension * MM_PIX_RATIO;
}
let pix2mm = (dimension) => {
  return dimension / MM_PIX_RATIO;
}



let drawDebugText = () => {
  
  push();

  cam.beginHUD();
  
  // FPS & PIXEL DENSITY INFO
  if (frameCount % 20 == 0) fpsInfoText = Math.floor(frameRate());
  let infoText = '';
  infoText += fpsAvg + '(' + fpsInfoText + ')';
  infoText += '/';
  infoText += pixelDensity().toFixed(1) + '(' + PIX_DENS_INIT + ')';
  // infoText += '/';
  // infoTezt += ;
  
  fill(BACKGROUND_COLOR);
  noStroke();
  let fromBottom = materialSelect.height*UI_SCL;
  rect(0, height - fromBottom*2.1, width/3, height);
  
  fill(CASKET_COLOR_INIT);     // TEXT COLOR
  textAlign(LEFT);
  translate(UI_PADDING, height - fromBottom * 1.5);
  text(infoText, 0, 0);


  
//   // CASKET INNER SIZE & VOLUME INFO
//   textSize(casket.infoText.size);
//   fill(casket.infoText.fillColor);
//   text(casket.infoText.text1, 0, 0);
//   translate(0, casket.infoText.size*1.5, 0);
//   text(casket.infoText.text2, 0, 0);
  
  

//   // CAM ROTATION INFO
//   translate(width/2, casket.infoText.size*3);

//   if (frameCount % 60 == 0) {
//     [camRotation[0], camRotation[1], camRotation[2], camRotation[3]] = cam.getRotation();

//     for (let i = 0; i < camRotation.length; i++) {
//       camRotation[i] = camRotation[i].toFixed(2);
//     }
//   }

//   text(camRotation[0] + ' : ' + camRotation[1] + ' : ' + camRotation[2] + ' : ' + camRotation[3], 0, 0);
  
  
  
  // // TAP/CLICK POSITION INFO
  // let tapPosInfo = '';
  // if (tapPos) {
  //   tapPosInfo = floor(tapPos.x) + '/' + floor(tapPos.y);
  // }
  // text(numTaps + ' - ' + tapPosInfo, 0, 0);
  
  pop();
  
  cam.endHUD();
  
}



// let drawTextUnderBox = () => {
// //   // LIGHT OUTLINE FOR INFO-TEXT - NOT COMPLETED!
// //   push();
// //   let pos = casket.infoText.pos.copy();
// //   pos.z -= 1;
// //   translate(pos);
// //   textSize(casket.infoText.size*1.1);
// //   fill(casket.infoText.strokeColor);
// //   text(casket.infoText.text, 0, 0);
// //   pop();
  
//   push();
//   translate(casket.infoText.pos);
//   translate(0, -casket.infoText.size*0.5, 0);
  
//   // CASKET INNER SIZE & VOLUME INFO
//   textSize(casket.infoText.size);
//   fill(casket.infoText.fillColor);
//   text(casket.infoText.text1, 0, 0);
//   translate(0, casket.infoText.size*1.1, 0);
//   text(casket.infoText.text2, 0, 0);

//   pop();
// }

































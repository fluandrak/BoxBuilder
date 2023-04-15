let casketInit = () => {
  
  let w = CASKET_WIDTH_INIT;
  let h = CASKET_HEIGHT_INIT;
  let d = CASKET_DEPTH_INIT;
  let thickness = CASKET_THICKNESS_INIT;
  // let w = mm2pix(CASKET_WIDTH_INIT);
  // let h = mm2pix(CASKET_HEIGHT_INIT);
  // let d = mm2pix(CASKET_DEPTH_INIT);
  // let thickness = mm2pix(CASKET_THICKNESS_INIT);
  let pos = createVector(0, 0, 0);
  let material = MATERIAL_INIT;
  casket = new Casket(pos, w, h, d, thickness, CASKET_COLOR_INIT, material);
  
}

  













